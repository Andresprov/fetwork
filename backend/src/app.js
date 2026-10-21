const path = require("path");
const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const modulosConfig = require("./config/modulos.config");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Content-Disposition se expone para que el frontend lea el nombre del .docx
// exportado (CU-09).
app.use(cors({ exposedHeaders: ["Content-Disposition"] }));
app.use(express.json());

// Archivos publicos subidos por los usuarios (foto de perfil) cuando se
// guardaron en el disco local (src/lib/almacenamiento). Solo se sirven las
// carpetas publicas: las hojas de vida adjuntas se descargan por la API, que
// respeta la configuracion de visibilidad del estudiante.
const almacenamientoLocal = require("./lib/almacenamiento/almacenamiento.local");
for (const carpeta of almacenamientoLocal.CARPETAS_PUBLICAS) {
  app.use(`/uploads/${carpeta}`, express.static(path.join(almacenamientoLocal.DIR_UPLOADS, carpeta), { index: false, dotfiles: "deny" }));
}

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
