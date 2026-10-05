Aquí tienes actualizado el contenido completo del archivo `README.md` incluyendo a todos los integrantes del equipo en un solo bloque listo para copiar:

```markdown
# Sistema de Microservicios - Gestión de Citas Médicas 🏥

## 📋 Descripción de la Empresa y la Solución
**MediMicro Services S.A.S.** es una empresa dedicada al desarrollo de soluciones tecnológicas en salud. Este proyecto consiste en una plataforma moderna basada en una **arquitectura de microservicios** orientada a optimizar la gestión, agendamiento y control de **citas médicas** para clínicas y hospitales. 

El sistema desacopla las responsabilidades críticas del negocio (gestión de pacientes/médicos, catálogo de servicios de salud, control de citas y pasarela de autenticación) para garantizar alta disponibilidad, escalabilidad y un rendimiento óptimo.

---

## 🎯 ¿A quién está dirigido?
* **Pacientes:** Personas que necesitan registrarse, iniciar sesión de forma segura y agendar, consultar o cancelar sus citas médicas con diferentes especialistas de manera rápida desde una interfaz web (Angular).
* **Personal Médico y Administrativo:** Usuarios con roles avanzados que gestionan la disponibilidad de turnos, historiales de citas y el directorio de profesionales de la salud.
* **Evaluadores y Docentes Universitarios:** Entes académicos que validan la correcta implementación de patrones de diseño de microservicios, separación por capas (`controllers`, `services`, `repositories`, `routes`, `models`), control de versiones con Git Flow y seguridad basada en tokens **JWT**.

---

## 👥 Participantes del Proyecto
* Andrés Juan Cardona García
* Juan Camilo
* Daniel Blandon

---

## ⚙️ Arquitectura del Sistema y Puertos
El sistema se compone de un **API Gateway** central y microservicios independientes comunicados mediante protocolos HTTP/Axios:
* **API Gateway:** `Puerto 3000` (Enruta las peticiones de los clientes)
* **Microservicio de Usuarios / Autenticación:** `Puerto 3001` (Gestión de pacientes/médicos y emisión de JWT)
* **Microservicio de Citas / Especialidades:** `Puerto 3002` (Lógica de agendamiento y gestión médica)

---

## 🚀 Instalación y Puesta en Marcha

1. Clonar el repositorio:
   ```bash
   git clone <[H](https://github.com/Andre908c/ADJ-IPS)>

```

1. Instalar las dependencias en cada microservicio (Gateway y servicios individuales):
```bash
npm install

```


3. Configurar las variables de entorno en cada microservicio usando un archivo `.env`:
```env
PORT=3001
JWT_SECRET=tu_clave_secreta_para_jwt_123

```


4. Iniciar los servidores en modo de desarrollo:
```bash
npm run dev

```



```

<ElicitationsGroup>
  <Elicitations message="¿Qué te gustaría hacer a continuación con el proyecto?">
    <Elicitation label="Middleware de JWT en Gateway" query="¿Cómo implemento la validación del token JWT en el API Gateway?"/>
    <Elicitation label="Estructura de Citas Médicas" query="Muéstrame el código por capas para el microservicio de citas médicas"/>
    <Elicitation label="Unificar en Main (Merge)" query="¿Cómo hacemos el merge de todas las ramas en main en GitHub?"/>
  </Elicitations>
</ElicitationsGroup>

```