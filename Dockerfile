# Usar una imagen oficial y ligera de Node.js
FROM node:18-alpine

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instalar las dependencias de producción/desarrollo
RUN npm install

# Copiar el resto del código fuente del microservicio
COPY . .

# Exponer el puerto en el que corre el servicio (ej: 3000, 3001 o 3002)
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]