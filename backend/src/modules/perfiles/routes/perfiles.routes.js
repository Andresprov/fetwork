const { Router } = require("express");
const asyncHandler = require("../../../middleware/asyncHandler");
const { requireAuth, requireRol } = require("../../../middleware/auth");
const controller = require("../controller/perfiles.controller");

// Modulo de perfiles del estudiante: CU-02 (datos del perfil), CU-03
// (habilidades, experiencia, certificaciones), CU-06 (visibilidad) y CU-07
// (vista publica, reutilizada por empresa en CU-16/CU-17).
const router = Router();

// Rutas publicas (no requieren sesion).
router.get("/habilidades/catalogo", asyncHandler(controller.getCatalogoHabilidades));
router.get("/:idEstudiante/publico", asyncHandler(controller.getPerfilPublico));

// Todo lo que cuelga de /me exige JWT de un estudiante.
const soloEstudiante = [requireAuth, requireRol("estudiante")];

router.get("/me", soloEstudiante, asyncHandler(controller.getMiPerfil));
router.put("/me", soloEstudiante, asyncHandler(controller.putMiPerfil));
router.put("/me/visibilidad", soloEstudiante, asyncHandler(controller.putVisibilidad));

router.get("/me/habilidades", soloEstudiante, asyncHandler(controller.getMisHabilidades));
router.post("/me/habilidades", soloEstudiante, asyncHandler(controller.postHabilidad));
router.delete("/me/habilidades/:idHabilidad", soloEstudiante, asyncHandler(controller.deleteHabilidad));

router.get("/me/experiencias", soloEstudiante, asyncHandler(controller.getExperiencias));
router.post("/me/experiencias", soloEstudiante, asyncHandler(controller.postExperiencia));
router.put("/me/experiencias/:id", soloEstudiante, asyncHandler(controller.putExperiencia));
router.delete("/me/experiencias/:id", soloEstudiante, asyncHandler(controller.deleteExperiencia));

router.get("/me/certificaciones", soloEstudiante, asyncHandler(controller.getCertificaciones));
router.post("/me/certificaciones", soloEstudiante, asyncHandler(controller.postCertificacion));
router.put("/me/certificaciones/:id", soloEstudiante, asyncHandler(controller.putCertificacion));
router.delete("/me/certificaciones/:id", soloEstudiante, asyncHandler(controller.deleteCertificacion));

module.exports = router;
