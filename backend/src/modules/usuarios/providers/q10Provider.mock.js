// Implementa el contrato de Q10Provider (ver q10Provider.interface.js) con un
// roster fijo en memoria, para poder desarrollar y probar el login sin acceso
// real a la SSO de Q10 (seccion 3 de CLAUDE.md).
const ROSTER = [
  {
    codigo_institucional_q10: "EST2021001",
    correo: "juan.perez@fet.edu.co",
    nombres: "Juan",
    apellidos: "Pérez",
    rol: "estudiante",
    programa: "Ingeniería de Software",
    semestre: 8,
  },
  {
    codigo_institucional_q10: "EST2021002",
    correo: "maria.gomez@fet.edu.co",
    nombres: "María",
    apellidos: "Gómez",
    rol: "estudiante",
    programa: "Tecnología en Desarrollo de Software",
    semestre: 5,
  },
  {
    codigo_institucional_q10: "EST2022003",
    correo: "camilo.rojas@fet.edu.co",
    nombres: "Camilo",
    apellidos: "Rojas",
    rol: "estudiante",
    programa: "Ingeniería de Software",
    semestre: 6,
  },
  {
    codigo_institucional_q10: "DOC0001",
    correo: "laura.martinez@fet.edu.co",
    nombres: "Laura",
    apellidos: "Martínez",
    rol: "docente",
  },
  {
    codigo_institucional_q10: "DOC0002",
    correo: "andres.lopez@fet.edu.co",
    nombres: "Andrés",
    apellidos: "López",
    rol: "docente",
  },
];

async function getRoster() {
  return ROSTER;
}

async function findByCodigo(codigo) {
  return ROSTER.find((c) => c.codigo_institucional_q10 === codigo) || null;
}

module.exports = { getRoster, findByCodigo };
