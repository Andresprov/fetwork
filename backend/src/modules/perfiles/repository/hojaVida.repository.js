const prisma = require("../../../lib/prisma");

// Datos privados de la hoja de vida institucional PA-GTH-F-10 (seccion 7.3).
// Este repositorio solo lo usa el service de hoja de vida; la vista publica
// del perfil nunca consulta estas tablas.
//
// Igual que en perfiles.repository, toda escritura filtra por id_estudiante
// ademas del id del registro.

// Recursos 1 a N con el mismo patron CRUD.
const RECURSOS = {
  titulos: {
    modelo: "tituloAcademico",
    id: "id_titulo",
    orderBy: [{ fecha_grado: { sort: "desc", nulls: "first" } }, { id_titulo: "desc" }],
  },
  actividades: {
    modelo: "actividadInvestigativa",
    id: "id_actividad",
    orderBy: [{ id_actividad: "desc" }],
  },
  referencias: {
    modelo: "referencia",
    id: "id_referencia",
    orderBy: [{ tipo: "asc" }, { id_referencia: "asc" }],
  },
};

function delegado(recurso) {
  return prisma[RECURSOS[recurso].modelo];
}

async function listar(recurso, id_estudiante) {
  return delegado(recurso).findMany({ where: { id_estudiante }, orderBy: RECURSOS[recurso].orderBy });
}

async function crear(recurso, id_estudiante, data) {
  return delegado(recurso).create({ data: { ...data, id_estudiante } });
}

async function buscar(recurso, id_estudiante, id) {
  return delegado(recurso).findFirst({ where: { [RECURSOS[recurso].id]: id, id_estudiante } });
}

async function actualizar(recurso, id, data) {
  return delegado(recurso).update({ where: { [RECURSOS[recurso].id]: id }, data });
}

async function eliminar(recurso, id_estudiante, id) {
  const { count } = await delegado(recurso).deleteMany({ where: { [RECURSOS[recurso].id]: id, id_estudiante } });
  return count;
}

// ---------- Datos personales (1 a 1) ----------

async function findDatosPersonales(id_estudiante) {
  return prisma.datosPersonalesCv.findUnique({ where: { id_estudiante } });
}

async function guardarDatosPersonales(id_estudiante, data) {
  return prisma.datosPersonalesCv.upsert({
    where: { id_estudiante },
    update: data,
    create: { ...data, id_estudiante },
  });
}

module.exports = {
  RECURSOS,
  listar,
  crear,
  buscar,
  actualizar,
  eliminar,
  findDatosPersonales,
  guardarDatosPersonales,
};
