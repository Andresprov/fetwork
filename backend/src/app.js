const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const modulosConfig = require("./config/modulos.config");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  let db = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "connected";
  } catch (err) {
    db = "disconnected";
    console.error("[health] fallo la conexion a la base de datos:", err);
  }

  res.json({ status: "ok", db, timestamp: new Date().toISOString() });
});

// Registro condicional de routers por modulo (seccion 5 de CLAUDE.md): un
// modulo desactivado por config simplemente no se monta.
if (modulosConfig.usuarios) {
  app.use("/api/usuarios", require("./modules/usuarios/routes/usuarios.routes"));
}
if (modulosConfig.empresas) {
  app.use("/api/empresas", require("./modules/empresas/routes/empresas.routes"));
}
if (modulosConfig.perfiles) {
  app.use("/api/perfiles", require("./modules/perfiles/routes/perfiles.routes"));
}
if (modulosConfig.proyectos) {
  app.use("/api/proyectos", require("./modules/proyectos/routes/proyectos.routes"));
}
if (modulosConfig.administracion) {
  app.use("/api/administracion", require("./modules/administracion/routes/administracion.routes"));
}

app.use((req, res) => {
  res.status(404).json({ error: "Recurso no encontrado." });
});

// Manejador de errores global de ultima instancia: debe ir al final.
app.use(errorHandler);

module.exports = app;
