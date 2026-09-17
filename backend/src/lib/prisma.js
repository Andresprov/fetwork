// El generador "prisma-client" de Prisma 7 emite TypeScript puro (ESM), sin
// index.js compilado; por eso el backend se ejecuta con `tsx` (ver package.json)
// y este require debe apuntar al archivo concreto, no al directorio.
const { PrismaClient } = require("../generated/prisma/client");
// Prisma 7 requiere un driver adapter explicito (ya no basta con la URL del
// datasource): la conexion Postgres real la resuelve @prisma/adapter-pg con
// la misma DATABASE_URL usada por prisma.config.ts.
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
