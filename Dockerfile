# 1. Usamos una imagen ultra liviana de Node.js v20
FROM node:20-alpine

# 2. Definimos la carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos las librerías de producción
RUN npm install

# 5. Copiamos todo el código de la API (incluyendo tu archivo JSON de datos)
COPY . .

# 6. IMPORTANTE PARA RENDER: Usamos la variable de entorno para exponer el puerto
ENV PORT=3001
EXPOSE ${PORT}

# 7. Comando de arranque de la API
CMD ["npm", "run", "start"]