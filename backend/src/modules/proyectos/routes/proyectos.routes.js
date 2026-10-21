const { Router } = require("express");
const asyncHandler = require("../../../middleware/asyncHandler");
const { requireAuth, requireRol } = require("../../../middleware/auth");
const controller = require("../controller/proyectos.controller");

// Modulo proyectos: CU-04 (gestionar proyectos y portafolio) y CU-05
// (vincular repositorio de GitHub). La busqueda de talento y las vacantes
// (CU-15, CU-18, CU-19) se agregaran en el Sprint 5.
const router = Router();

const soloEstudiante = [requireAuth, requireRol("estudiante")];

router.get("/me", soloEstudiante, asyncHandler(controller.getMisProyectos));
router.post("/me", soloEstudiante, asyncHandler(controller.postProyecto));
// Sincronizacion con GitHub (CU-05). Van antes de /me/:id.
router.get("/me/github/repositorios", soloEstudiante, asyncHandler(controller.getRepositoriosGithub));
router.post("/me/github/importar", soloEstudiante, asyncHandler(controller.postImportarGithub));
router.get("/me/github/repositorio", soloEstudiante, asyncHandler(controller.getRepositorioGithub));

router.get("/me/:id", soloEstudiante, asyncHandler(controller.getMiProyecto));
router.put("/me/:id", soloEstudiante, asyncHandler(controller.putProyecto));
router.delete("/me/:id", soloEstudiante, asyncHandler(controller.deleteProyecto));

module.exports = router;
