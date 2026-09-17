const { Router } = require("express");

// Modulo en construccion: cubrira CU-21 a CU-28 (auditoria de docentes,
// asignaciones del Coordinador de Pasantias y del Validador de Empresas).
// No forma parte del alcance de Sprint 1 (autenticacion).
const router = Router();

router.use((req, res) => {
  res.status(501).json({ error: "Modulo 'administracion' aun no implementado." });
});

module.exports = router;
