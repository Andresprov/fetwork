const prisma = require("../../../lib/prisma");

// Todas las consultas de escritura sobre experiencias, certificaciones y
// habilidades filtran por id_estudiante ademas del id del registro: un
// estudiante nunca puede leer ni modificar filas de otro.

const includePerfil = {
  usuario: { select: { correo: true, codigo_institucional_q10: true, activo: true } },
  programa: true,
  _count: { select: { habilidades: true, experiencias: true, certificaciones: true, proyectos: true } },
};

async function findEstudiantePorUsuario(id_usuario) {
  return prisma.estudiante.findUnique({ where: { id_usuario }, include: includePerfil });
}

async function findEstudiantePorId(id_estudiante) {
  return prisma.estudiante.findUnique({ where: { id_estudiante }, include: includePerfil });
}

async function actualizarEstudiante(id_estudiante, data) {
  return prisma.estudiante.update({ where: { id_estudiante }, data, include: includePerfil });
}

// ---------- Habilidades ----------

async function listarCatalogoHabilidades() {
  return prisma.categoriaHabilidad.findMany({
    orderBy: { id_categoria: "asc" },
    include: { habilidades: { orderBy: { nombre: "asc" } } },
  });
}

async function findHabilidad(id_habilidad) {
  return prisma.habilidad.findUnique({ where: { id_habilidad } });
}

async function listarHabilidadesEstudiante(id_estudiante) {
  return prisma.estudianteHabilidad.findMany({
    where: { id_estudiante },
    include: { habilidad: { include: { categoria: true } } },
    orderBy: [{ habilidad: { id_categoria: "asc" } }, { habilidad: { nombre: "asc" } }],
  });
}

async function guardarHabilidadEstudiante(id_estudiante, id_habilidad, nivel) {
  return prisma.estudianteHabilidad.upsert({
    where: { id_estudiante_id_habilidad: { id_estudiante, id_habilidad } },
    update: { nivel },
    create: { id_estudiante, id_habilidad, nivel },
    include: { habilidad: { include: { categoria: true } } },
  });
}

async function eliminarHabilidadEstudiante(id_estudiante, id_habilidad) {
  const { count } = await prisma.estudianteHabilidad.deleteMany({ where: { id_estudiante, id_habilidad } });
  return count;
}

// ---------- Experiencias ----------

async function listarExperiencias(id_estudiante) {
  return prisma.experiencia.findMany({
    where: { id_estudiante },
    orderBy: [{ fecha_inicio: { sort: "desc", nulls: "last" } }, { id_experiencia: "desc" }],
  });
}

async function crearExperiencia(id_estudiante, data) {
  return prisma.experiencia.create({ data: { ...data, id_estudiante } });
}

async function findExperiencia(id_estudiante, id_experiencia) {
  return prisma.experiencia.findFirst({ where: { id_experiencia, id_estudiante } });
}

async function actualizarExperiencia(id_experiencia, data) {
  return prisma.experiencia.update({ where: { id_experiencia }, data });
}

async function eliminarExperiencia(id_estudiante, id_experiencia) {
  const { count } = await prisma.experiencia.deleteMany({ where: { id_experiencia, id_estudiante } });
  return count;
}

// ---------- Certificaciones ----------

async function listarCertificaciones(id_estudiante) {
  return prisma.certificacion.findMany({
    where: { id_estudiante },
    orderBy: [{ fecha: { sort: "desc", nulls: "last" } }, { id_certificacion: "desc" }],
  });
}

async function crearCertificacion(id_estudiante, data) {
  return prisma.certificacion.create({ data: { ...data, id_estudiante } });
}

async function findCertificacion(id_estudiante, id_certificacion) {
  return prisma.certificacion.findFirst({ where: { id_certificacion, id_estudiante } });
}

async function actualizarCertificacion(id_certificacion, data) {
  return prisma.certificacion.update({ where: { id_certificacion }, data });
}

async function eliminarCertificacion(id_estudiante, id_certificacion) {
  const { count } = await prisma.certificacion.deleteMany({ where: { id_certificacion, id_estudiante } });
  return count;
}

module.exports = {
  findEstudiantePorUsuario,
  findEstudiantePorId,
  actualizarEstudiante,
  listarCatalogoHabilidades,
  findHabilidad,
  listarHabilidadesEstudiante,
  guardarHabilidadEstudiante,
  eliminarHabilidadEstudiante,
  listarExperiencias,
  crearExperiencia,
  findExperiencia,
  actualizarExperiencia,
  eliminarExperiencia,
  listarCertificaciones,
  crearCertificacion,
  findCertificacion,
  actualizarCertificacion,
  eliminarCertificacion,
};
