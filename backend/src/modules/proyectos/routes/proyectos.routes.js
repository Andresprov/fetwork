const { Router } = require("express");

// Modulo en construccion: cubrira CU-04, CU-05, CU-15 a CU-19 (portafolio,
// GitHub, busqueda de talento y vacantes). No forma parte del alcance de
// Sprint 1 (autenticacion).
const router = Router();

router.use((req, res) => {
  res.status(501).json({ error: "Modulo 'proyectos' aun no implementado." });
});

module.exports = router;
