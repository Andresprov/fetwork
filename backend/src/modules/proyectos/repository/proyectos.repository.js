const prisma = require("../../../lib/prisma");

async function listarPorEstudiante(id_estudiante) {
  return prisma.proyecto.findMany({
    where: { id_estudiante },
    include: { tecnologias: true, enlaces: true },
    orderBy: [{ fecha: { sort: "desc", nulls: "last" } }, { id_proyecto: "desc" }],
  });
}

module.exports = { listarPorEstudiante };
