const prisma = require("../../../lib/prisma");

async function ensurePrograma(nombre) {
  const existente = await prisma.programaAcademico.findFirst({ where: { nombre } });
  if (existente) return existente;
  return prisma.programaAcademico.create({ data: { nombre } });
}

// Upsert de la cuenta Q10 (usuario +, si es estudiante, fila en estudiantes).
// Simula lo que haria una sincronizacion real con Q10 en el primer login.
async function upsertCuentaQ10(cuenta) {
  const usuario = await prisma.usuario.upsert({
    where: { codigo_institucional_q10: cuenta.codigo_institucional_q10 },
    update: {
      correo: cuenta.correo,
      activo: true,
    },
    create: {
      codigo_institucional_q10: cuenta.codigo_institucional_q10,
      correo: cuenta.correo,
      rol: cuenta.rol,
      origen_autenticacion: "q10",
      activo: true,
    },
  });

  if (cuenta.rol === "estudiante") {
    const programa = await ensurePrograma(cuenta.programa);
    const estudiante = await prisma.estudiante.upsert({
      where: { id_usuario: usuario.id_usuario },
      update: {
        nombres: cuenta.nombres,
        apellidos: cuenta.apellidos,
        id_programa: programa.id_programa,
        semestre: cuenta.semestre ?? null,
      },
      create: {
        id_usuario: usuario.id_usuario,
        id_programa: programa.id_programa,
        nombres: cuenta.nombres,
        apellidos: cuenta.apellidos,
        semestre: cuenta.semestre ?? null,
      },
    });
    return { usuario, estudiante };
  }

  return { usuario, estudiante: null };
}

module.exports = { ensurePrograma, upsertCuentaQ10 };
