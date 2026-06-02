#  Establecemos una 'imagen' liviana de mnode (5mb)
FROM node:20-alpine

# Al crear un contenedor, debemos establecer la carpeta de trabajo (ruta por convención)
WORKDIR /usr/src/app

# Realizamos una copia del archivo con los módulos/dependencias (package.json)
COPY package*.json ./

# Se intalan las librerias de 'package.json'
RUN npm install

# Copiamos todo el código de la API al entonrno de Docker
COPY . .

# Puerto
ENV PORT=3000
EXPOSE ${PORT}

# Qué se ejecuta en el arranque
CMD ["npm", "run", "start"]