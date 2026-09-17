// Implementa el contrato de Q10Provider (ver q10Provider.interface.js) con un
// roster fijo en memoria, para poder desarrollar y probar el login sin acceso
// real a la SSO de Q10 (seccion 3 de CLAUDE.md).
const ROSTER = [
  {
    codigo_institucional_q10: "EST2021001",
    correo: "juan.perez@fet.edu.co",
    nombres: "Juan",
    apellidos: "Perez",
    rol: "estudiante",
    programa: "Ingenieria de Software",
  },
  {
    codigo_institucional_q10: "EST2021002",
    correo: "maria.gomez@fet.edu.co",
    nombres: "Maria",
    apellidos: "Gomez",
    rol: "estudiante",
    programa: "Tecnologia en Desarrollo de Software",
  },
  {
    codigo_institucional_q10: "EST2022003",
    correo: "camilo.rojas@fet.edu.co",
    nombres: "Camilo",
    apellidos: "Rojas",
    rol: "estudiante",
    programa: "Ingenieria de Software",
  },
  {
    codigo_institucional_q10: "DOC0001",
    correo: "laura.martinez@fet.edu.co",
    nombres: "Laura",
    apellidos: "Martinez",
    rol: "docente",
  },
  {
    codigo_institucional_q10: "DOC0002",
    correo: "andres.lopez@fet.edu.co",
    nombres: "Andres",
    apellidos: "Lopez",
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
