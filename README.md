# MediMicro IPS

Sistema modular de gestión clínica e institucional basado en **microservicios** (Node.js + Express + PostgreSQL), organizado como monorepo y desarrollado en GitHub Codespaces.

## Contenido

1. [Arquitectura](#arquitectura)
2. [Requisitos](#requisitos)
3. [Configuración](#configuración)
4. [Iniciar y detener los microservicios](#iniciar-y-detener-los-microservicios)
5. [GitHub Codespaces](#github-codespaces)
6. [API](#api)
7. [Flujo de autenticación](#flujo-de-autenticación)
8. [Usuarios de prueba](#usuarios-de-prueba-solo-desarrollo)
9. [Consultar la base de datos](#consultar-la-base-de-datos)
10. [Estado actual](#estado-actual)
11. [Seguridad](#seguridad)
12. [Solución de problemas](#solución-de-problemas)

## Arquitectura

```
ADJ-IPS/
├── auth-service/        # Autenticación (JWT + bcrypt)        → puerto 3004
├── ms-citas/            # Citas y agendas médicas             → puerto 3002
├── pharmacy-service/    # Módulo de farmacia                  → (pendiente documentar)
├── frontend/            # HTML + JavaScript vanilla           → puerto 5500
├── sql/init.sql         # Esquema inicial de la base de datos
└── docker-compose.yml   # PostgreSQL 15
```

| Componente | Puerto | Tecnología |
|---|---|---|
| auth-service | 3004 | Express, pg, jsonwebtoken, bcrypt, cors |
| ms-citas | 3002 | Express, pg, jsonwebtoken, dotenv, cors |
| Frontend | 5500 | HTML plano + JS vanilla (`npx serve`) |
| PostgreSQL | 5432 | postgres:15-alpine (Docker) |

El `auth-service` emite el JWT y `ms-citas` lo valida con el **mismo `JWT_SECRET`**. El token contiene `id`, `username` y `rol`, y dura 2 horas.

## Requisitos

- Node.js 18 o superior
- Docker (para PostgreSQL)
- GitHub CLI (`gh`), solo si usas Codespaces

## Configuración

### 1. Base de datos

```bash
docker compose up -d postgres
```

Tablas necesarias: `usuarios`, `agendas`, `citas`. `sql/init.sql` solo se ejecuta la primera vez que se crea el volumen. Si la base ya existía, aplícalo manualmente:

```bash
docker exec -i medimicro_postgres psql -U postgres -d medimicro_db < sql/init.sql
```

Esquema de citas:

```sql
CREATE TABLE IF NOT EXISTS agendas (
    id SERIAL PRIMARY KEY,
    medico_id INTEGER REFERENCES usuarios(id),
    fecha_hora TIMESTAMP NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE'
);

CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    agenda_id INTEGER NOT NULL REFERENCES agendas(id),
    paciente_id INTEGER NOT NULL REFERENCES usuarios(id),
    estado VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 2. Variables de entorno

Cada servicio tiene su propio `.env` (**no se sube al repositorio**).

`auth-service/.env`

```env
PORT=3004
DATABASE_URL=postgresql://postgres:<PASSWORD>@localhost:5432/medimicro_db
JWT_SECRET=<SECRETO_LARGO_ALEATORIO>
```

`ms-citas/.env`

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<PASSWORD>
DB_NAME=medimicro_db
JWT_SECRET=<EL_MISMO_SECRETO_DEL_AUTH_SERVICE>
```

Generar un secreto:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Instalar dependencias

```bash
cd auth-service && npm install
cd ../ms-citas && npm install
```

## Iniciar y detener los microservicios

Ejecuta los comandos desde la raíz del proyecto (`/workspaces/ADJ-IPS`).

### Iniciar

**1. Base de datos**

```bash
docker compose up -d postgres
```

**2. Servicios en segundo plano**

```bash
(cd auth-service && nohup npm start > auth.log 2>&1 &)
(cd ms-citas && nohup npm start > citas.log 2>&1 &)
nohup npx serve frontend -l 5500 > front.log 2>&1 &
```

**3. Puertos públicos** (solo Codespaces)

```bash
gh codespace ports visibility 3004:public 3002:public 5500:public -c $CODESPACE_NAME
```

**4. Verificar**

```bash
ss -tlnp | grep -E '3004|3002|5500'
curl -s http://localhost:3004/
curl -s -o /dev/null -w "citas: %{http_code}\n" http://localhost:3002/api/agendas
```

Esperado: los tres puertos escuchando y `citas: 401`, porque esa ruta pide token.

**5. Ver logs**

```bash
tail -f auth-service/auth.log
tail -f ms-citas/citas.log
```

### Iniciar en terminales separadas (alternativa)

```bash
# Terminal 1
cd auth-service && npm start

# Terminal 2
cd ms-citas && npm start

# Terminal 3
npx serve frontend -l 5500
```

### Detener

**Los tres servicios**

```bash
fuser -k 3004/tcp 3002/tcp 5500/tcp
```

**Uno solo**

```bash
fuser -k 3004/tcp   # auth-service
fuser -k 3002/tcp   # ms-citas
fuser -k 5500/tcp   # frontend
```

Si `fuser` no mata el proceso:

```bash
pkill -f "node src/index.js"   # auth-service
pkill -f "node src/app.js"     # ms-citas
```

**Base de datos**

```bash
docker compose stop postgres    # conserva los datos
docker compose down             # elimina el contenedor (el volumen sigue)
```

### Reiniciar un servicio

Hazlo siempre que cambies un `.env`, porque solo se lee al arrancar:

```bash
fuser -k 3002/tcp
(cd ms-citas && nohup npm start > citas.log 2>&1 &)
```

### Scripts `start.sh` y `stop.sh` (opcional)

Para no repetir los comandos, créalos con `printf` en la terminal. Así no quedan líneas sobrantes si el pegado sale mal:

```bash
printf '#!/bin/bash\ncd "$(dirname "$0")"\ndocker compose up -d postgres\n(cd auth-service && nohup npm start > auth.log 2>&1 &)\n(cd ms-citas && nohup npm start > citas.log 2>&1 &)\nnohup npx serve frontend -l 5500 > front.log 2>&1 &\nsleep 4\ngh codespace ports visibility 3004:public 3002:public 5500:public -c $CODESPACE_NAME\necho "Servicios iniciados"\n' > start.sh

printf '#!/bin/bash\nfuser -k 3004/tcp 3002/tcp 5500/tcp 2>/dev/null\necho "Servicios detenidos"\n' > stop.sh

chmod +x start.sh stop.sh
```

Uso:

```bash
./start.sh
./stop.sh
```

Para detener también la base de datos, agrega `docker compose stop postgres` al final de `stop.sh`.

## GitHub Codespaces

Los tres puertos deben estar en **Public** y el frontend debe usar las URLs públicas:

```bash
gh codespace ports visibility 3004:public 3002:public 5500:public -c $CODESPACE_NAME
```

Las URLs del API se configuran en `frontend/app.js`. Si se recrea el Codespace, actualízalas:

```js
const API_URL   = 'https://<codespace>-3004.app.github.dev';
const CITAS_URL = 'https://<codespace>-3002.app.github.dev';
```

Abrir el frontend: `https://<codespace>-5500.app.github.dev/login`

## API

### auth-service (`:3004`)

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| GET | `/` | — | `{"message":"Auth Service API running successfully"}` |
| POST | `/api/auth/register` | `{ username, password, rol? }` | `201`, o `409` si el usuario existe |
| POST | `/api/auth/login` | `{ username, password }` | `{ message, token, user: { id, username, rol } }` |

### ms-citas (`:3002`)

Todas las rutas exigen `Authorization: Bearer <token>`. El `paciente_id` se toma del token, nunca del cuerpo de la petición.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/agendas` | Agendas con estado `DISPONIBLE` |
| POST | `/api/citas` | Agenda una cita. Cuerpo: `{ "agenda_id": 1 }` |
| GET | `/api/citas/mias` | Citas del usuario autenticado |

Agendar una cita se hace en una transacción: bloquea la agenda (`FOR UPDATE`), crea la cita y marca la agenda como `OCUPADO`.

## Flujo de autenticación

1. `login.html` envía `username` y `password` a `/api/auth/login`.
2. Se guarda el token en `localStorage` (`token`, `rol`, `username`).
3. Según el `rol` del JWT redirige a `dashboard-medico.html` o `dashboard-paciente.html`.
4. Los dashboards envían el token en cada petición a `ms-citas`.

## Usuarios de prueba (solo desarrollo)

| Rol | Usuario | Contraseña |
|---|---|---|
| Paciente | `testuser` | `Test1234!` |
| Médico | `drprueba` | `Test1234!` |

Crear un usuario por `curl`:

```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"nuevo","password":"Clave1234!","rol":"paciente"}'
```

Si el registro no asigna el rol, cámbialo en la base:

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db \
  -c "UPDATE usuarios SET rol='medico' WHERE username='nuevo';"
```

## Consultar la base de datos

PostgreSQL corre en el contenedor `medimicro_postgres` (base `medimicro_db`, usuario `postgres`).

### Consola interactiva

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db
```

Comandos útiles dentro de `psql`:

| Comando | Qué hace |
|---|---|
| `\dt` | Lista las tablas |
| `\d usuarios` | Muestra las columnas de una tabla |
| `\x` | Alterna el formato expandido (útil con filas anchas) |
| `\q` | Salir |

### Consultas rápidas

**Tablas**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c '\dt'
```

**Usuarios** (sin la columna de contraseña)

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "SELECT id, username, rol FROM usuarios ORDER BY id;"
```

**Agendas**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "SELECT * FROM agendas ORDER BY id;"
```

**Citas**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "SELECT * FROM citas ORDER BY id;"
```

**Citas con paciente y fecha**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "SELECT c.id, u.username AS paciente, a.fecha_hora, c.estado FROM citas c JOIN usuarios u ON u.id = c.paciente_id JOIN agendas a ON a.id = c.agenda_id ORDER BY a.fecha_hora;"
```

### Modificar datos

**Cambiar el rol de un usuario**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "UPDATE usuarios SET rol='medico' WHERE username='drprueba';"
```

**Crear una agenda de prueba para un médico**

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "INSERT INTO agendas (medico_id, fecha_hora) SELECT id, NOW() + INTERVAL '2 days' FROM usuarios WHERE username='drprueba';"
```

**Liberar una agenda y borrar su cita** (para repetir pruebas)

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "DELETE FROM citas WHERE agenda_id=1;" -c "UPDATE agendas SET estado='DISPONIBLE' WHERE id=1;"
```

**Borrar un usuario** (si tiene citas, bórralas antes por la clave foránea)

```bash
docker exec -it medimicro_postgres psql -U postgres -d medimicro_db -c "DELETE FROM usuarios WHERE username='testuser2';"
```

### Respaldo y restauración

**Respaldo**

```bash
docker exec medimicro_postgres pg_dump -U postgres medimicro_db > respaldo.sql
```

**Restaurar**

```bash
docker exec -i medimicro_postgres psql -U postgres -d medimicro_db < respaldo.sql
```

### Notas

- Si el contenedor no responde, comprueba que esté arriba con `docker ps` o levántalo con `docker compose up -d postgres`.
- Evita `SELECT * FROM usuarios`: mostraría los hashes de las contraseñas. Selecciona solo las columnas que necesites.
- Antes de un `UPDATE` o `DELETE`, ejecuta el mismo `WHERE` con un `SELECT` para ver qué filas afectará.

## Estado actual

- [x] `auth-service`: registro, login y emisión de JWT
- [x] `ms-citas`: agendas, agendar cita y "mis citas", con validación de JWT
- [x] Login web con redirección por rol
- [x] Dashboard del paciente conectado a `ms-citas`
- [ ] Dashboard del médico (aún apunta a `localhost:3000`, sin API Gateway)
- [ ] Endpoint de agendas del médico (`GET /api/agendas/mias`) con comprobación de `rol`
- [ ] Documentar y conectar `pharmacy-service`
- [ ] Proteger el acceso por rol en el frontend (hoy solo se comprueba que exista token)
- [ ] Limpiar archivos duplicados: `auth-service/index.js` vs `src/index.js`, y `ms-citas/src/config/db.js` (MySQL, ya sin uso) vs `src/db.js`
- [ ] Actualizar `docker-compose.yml`: el `auth-service` sigue mapeado al puerto 3001

## Seguridad

- No subas los archivos `.env` al repositorio. Verifica que `.gitignore` incluya `.env` y `node_modules/`.
- `docker-compose.yml` contiene credenciales en texto plano: muévelas a un `.env` y usa `${VARIABLE}`.
- Rota la contraseña de PostgreSQL y el `JWT_SECRET` si alguna vez se compartieron.
- Las contraseñas se almacenan con `bcrypt`.
- Cambia las credenciales de prueba antes de cualquier despliegue real.

## Solución de problemas

| Síntoma | Causa probable |
|---|---|
| `EADDRINUSE` al arrancar | El puerto ya está en uso: `fuser -k <puerto>/tcp` |
| `Cannot find module 'pg'` | Falta `npm install` en ese servicio |
| `password authentication failed` | La contraseña del `.env` no coincide con la de Postgres |
| `relation "agendas" does not exist` | Faltan las tablas (ver sección de base de datos) |
| "No se pudo conectar con el servidor" | Puerto privado en Codespaces o `API_URL` desactualizada |
| `401 Token inválido` en `ms-citas` | `JWT_SECRET` distinto al del `auth-service` |
| Cambios del `.env` sin efecto | Hay que reiniciar el servicio |
| El frontend muestra la versión vieja | Recargar sin caché con Ctrl+Shift+R |