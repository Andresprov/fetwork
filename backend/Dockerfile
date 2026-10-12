# Imagen de despliegue del backend (Render / Railway). Incluye LibreOffice
# (solo Writer) para convertir la hoja de vida PA-GTH-F-10 a PDF; los
# entornos Node nativos de esas plataformas no lo traen.
FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends libreoffice-writer-nogui fonts-liberation fonts-dejavu-core fonts-crosextra-carlito fonts-crosextra-caladea \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# El cliente de Prisma se genera en src/generated/prisma (no se versiona).
RUN npx prisma generate && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
