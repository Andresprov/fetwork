// Flags por variable de entorno para activar/desactivar cada modulo del monolito
// modular (seccion 5 de CLAUDE.md). Un modulo desactivado simplemente no registra
// su router en app.js.
//
// El versionado "en linea / de respaldo" por modulo (seccion 5.2) queda preparado
// a nivel de config (ver comentario en cada modulo), pero por ahora solo existe
// una implementacion por modulo: no se fabrica una "version de respaldo" falsa.
function leerFlag(nombre, porDefecto = true) {
  const valor = process.env[nombre];
  if (valor === undefined) return porDefecto;
  return valor === "true";
}

const modulosConfig = {
  usuarios: leerFlag("MODULE_USUARIOS_ENABLED"),
  empresas: leerFlag("MODULE_EMPRESAS_ENABLED"),
  perfiles: leerFlag("MODULE_PERFILES_ENABLED"),
  proyectos: leerFlag("MODULE_PROYECTOS_ENABLED"),
  administracion: leerFlag("MODULE_ADMINISTRACION_ENABLED"),
};

module.exports = modulosConfig;
