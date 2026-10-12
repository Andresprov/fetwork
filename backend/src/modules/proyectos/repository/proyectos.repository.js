const prisma = require("../../../lib/prisma");

// Toda consulta de escritura filtra por id_estudiante ademas del id del
// proyecto: un estudiante nunca puede leer ni modificar proyectos de otro.

const includeDetalle = {
  tecnologias: { orderBy: { id_tecnologia: "asc" } },
  enlaces: { orderBy: { id_enlace: "asc" } },
};

async function listarPorEstudiante(id_estudiante) {
  return prisma.proyecto.findMany({
    where: { id_estudiante },
    include: includeDetalle,
    orderBy: [{ fecha: { sort: "desc", nulls: "last" } }, { id_proyecto: "desc" }],
  });
}

async function findProyecto(id_estudiante, id_proyecto) {
  return prisma.proyecto.findFirst({ where: { id_proyecto, id_estudiante }, include: includeDetalle });
}

async function crearProyecto(id_estudiante, { tecnologias, enlaces, ...data }) {
  return prisma.proyecto.create({
    data: {
      ...data,
      id_estudiante,
      tecnologias: { create: tecnologias.map((tecnologia) => ({ tecnologia })) },
      enlaces: { create: enlaces },
    },
    include: includeDetalle,
  });
}

// Tecnologias y enlaces se reemplazan completos en cada edicion: el
// formulario siempre envia la lista final.
async function actualizarProyecto(id_proyecto, { tecnologias, enlaces, ...data }) {
  return prisma.$transaction(async (tx) => {
    await tx.proyectoTecnologia.deleteMany({ where: { id_proyecto } });
    await tx.proyectoEnlace.deleteMany({ where: { id_proyecto } });
    return tx.proyecto.update({
      where: { id_proyecto },
      data: {
        ...data,
        tecnologias: { create: tecnologias.map((tecnologia) => ({ tecnologia })) },
        enlaces: { create: enlaces },
      },
      include: includeDetalle,
    });
  });
}

async function eliminarProyecto(id_estudiante, id_proyecto) {
  const { count } = await prisma.proyecto.deleteMany({ where: { id_proyecto, id_estudiante } });
  return count;
}

module.exports = { listarPorEstudiante, findProyecto, crearProyecto, actualizarProyecto, eliminarProyecto };
