const { Router } = require("express");
const multer = require("multer");
const { ErrorPeticion } = require("../../../lib/errores");
const asyncHandler = require("../../../middleware/asyncHandler");
const { requireAuth, requireRol } = require("../../../middleware/auth");
const controller = require("../controller/perfiles.controller");
const hojaVida = require("../controller/hojaVida.controller");

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

// Foto de perfil: multipart con el campo "foto". El tipo y el tamaño se
// validan en el service; el limite de multer solo corta subidas abusivas.
const subidaFoto = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1 } }).single("foto");
function recibirFoto(req, res, next) {
  subidaFoto(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const mensaje = err.code === "LIMIT_FILE_SIZE" ? "La foto no puede pesar más de 2 MB." : "Envía una sola imagen en el campo «foto».";
      return next(new ErrorPeticion(400, mensaje));
    }
    next(err);
  });
}
router.put("/me/foto", soloEstudiante, recibirFoto, asyncHandler(controller.putFoto));
router.delete("/me/foto", soloEstudiante, asyncHandler(controller.deleteFoto));

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

// Hoja de vida institucional PA-GTH-F-10: CU-08 (diligenciar) y CU-09
// (exportar). Datos privados: nunca salen por la vista publica.
router.get("/me/hoja-vida", soloEstudiante, asyncHandler(hojaVida.getHojaVida));
router.put("/me/hoja-vida/datos-personales", soloEstudiante, asyncHandler(hojaVida.putDatosPersonales));
router.get("/me/hoja-vida/exportar", soloEstudiante, asyncHandler(hojaVida.getExportar));

for (const recurso of ["titulos", "actividades", "referencias"]) {
  const crud = hojaVida[recurso];
  router.get(`/me/hoja-vida/${recurso}`, soloEstudiante, asyncHandler(crud.listar));
  router.post(`/me/hoja-vida/${recurso}`, soloEstudiante, asyncHandler(crud.crear));
  router.put(`/me/hoja-vida/${recurso}/:id`, soloEstudiante, asyncHandler(crud.actualizar));
  router.delete(`/me/hoja-vida/${recurso}/:id`, soloEstudiante, asyncHandler(crud.eliminar));
}

module.exports = router;
