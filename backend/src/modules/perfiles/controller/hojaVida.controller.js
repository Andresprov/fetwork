const service = require("../service/hojaVida.service");
const documento = require("../service/hojaVida.documento");

async function getHojaVida(req, res) {
  res.json(await service.obtenerHojaVida(req.usuario.id_usuario));
}

async function putDatosPersonales(req, res) {
  res.json(await service.guardarDatosPersonales(req.usuario.id_usuario, req.body || {}));
}

// CU-09: PDF generado desde el formato oficial PA-GTH-F-10. El frontend lo
// usa tanto para la vista previa como para la descarga.
async function getExportar(req, res) {
  const todo = await service.cargarTodo(req.usuario.id_usuario);
  const buffer = await documento.generarPdf(todo);
  const nombre = documento.nombreArchivo(todo.estudiante);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${nombre}"`);
  res.setHeader("Cache-Control", "no-store");
  res.send(buffer);
}

// titulos, actividades y referencias comparten el mismo CRUD.
function crudRecurso(recurso, clave) {
  return {
    listar: async (req, res) => {
      res.json({ [clave]: await service.listarRecurso(recurso, req.usuario.id_usuario) });
    },
    crear: async (req, res) => {
      res.status(201).json(await service.crearRecurso(recurso, req.usuario.id_usuario, req.body || {}));
    },
    actualizar: async (req, res) => {
      res.json(await service.actualizarRecurso(recurso, req.usuario.id_usuario, req.params.id, req.body || {}));
    },
    eliminar: async (req, res) => {
      await service.eliminarRecurso(recurso, req.usuario.id_usuario, req.params.id);
      res.status(204).end();
    },
  };
}

module.exports = {
  getHojaVida,
  putDatosPersonales,
  getExportar,
  titulos: crudRecurso("titulos", "titulos"),
  actividades: crudRecurso("actividades", "actividades"),
  referencias: crudRecurso("referencias", "referencias"),
};
