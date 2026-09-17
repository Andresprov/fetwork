const { Router } = require("express");

// Modulo en construccion: cubrira CU-02 a CU-09 (perfil, habilidades,
// experiencia, certificaciones, proyectos, hoja de vida institucional).
// No forma parte del alcance de Sprint 1 (autenticacion).
const router = Router();

router.use((req, res) => {
  res.status(501).json({ error: "Modulo 'perfiles' aun no implementado." });
});

module.exports = router;
