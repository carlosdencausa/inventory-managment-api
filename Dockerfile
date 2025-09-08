FROM node:18 AS builder

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias, incluyendo las de desarrollo necesarias para compilar
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Usar una imagen más ligera para la ejecución
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --only=production

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copiar los archivos de la base de datos
COPY --from=builder /usr/src/app/database ./database

# Crear directorio de base de datos si no existe y establecer permisos
RUN mkdir -p /usr/src/app/database && chmod 777 /usr/src/app/database

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]