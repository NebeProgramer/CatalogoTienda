FROM node:18-alpine
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY backend/package.json ./
RUN npm install --omit=dev

# Copiar el resto del código
COPY backend/ ./
COPY public/ ./public

# Puerto por defecto y variable de entorno
ENV PORT=3000
EXPOSE 3000

# Comando de arranque
CMD ["node", "server.js"]