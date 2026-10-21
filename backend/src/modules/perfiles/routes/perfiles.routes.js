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

// Subidas multipart de un solo archivo. El tipo y el tamaño se validan en el
// service; el limite de multer solo corta subidas abusivas.
function recibirArchivo(campo, maxBytes, { muyGrande, invalido }) {
  const subida = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1 } }).single(campo);
  return (req, res, next) => {
    subida(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return next(new ErrorPeticion(400, err.code === "LIMIT_FILE_SIZE" ? muyGrande : invalido));
      }
      next(err);
    });
  };
}

const recibirFoto = recibirArchivo("foto", 2 * 1024 * 1024, {
  muyGrande: "La foto no puede pesar más de 2 MB.",
  invalido: "Envía una sola imagen en el campo «foto».",
});
const recibirHojaVida = recibirArchivo("hoja_vida", 5 * 1024 * 1024, {
  muyGrande: "La hoja de vida no puede pesar más de 5 MB.",
  invalido: "Envía un solo PDF en el campo «hoja_vida».",
});

router.put("/me/foto", soloEstudiante, recibirFoto, asyncHandler(controller.putFoto));
router.delete("/me/foto", soloEstudiante, asyncHandler(controller.deleteFoto));

// Hoja de vida adjunta en PDF (distinta de la institucional PA-GTH-F-10).
router.get("/me/hoja-vida-archivo", soloEstudiante, asyncHandler(controller.getMiHojaVidaArchivo));
router.put("/me/hoja-vida-archivo", soloEstudiante, recibirHojaVida, asyncHandler(controller.putHojaVidaArchivo));
router.delete("/me/hoja-vida-archivo", soloEstudiante, asyncHandler(controller.deleteHojaVidaArchivo));

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

// Hoja de vida adjunta publica: solo si el estudiante muestra su contacto.
// Va al final para que no capture /me/hoja-vida-archivo como :idEstudiante.
router.get("/:idEstudiante/hoja-vida-archivo", asyncHandler(controller.getHojaVidaArchivoPublica));

module.exports = router;
