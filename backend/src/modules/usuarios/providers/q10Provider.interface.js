/**
 * Contrato que debe cumplir cualquier proveedor de autenticacion Q10.
 * Sprint 1 usa `q10Provider.mock.js`; cuando exista la integracion SSO real
 * (API abierta de Q10, seccion 3 de CLAUDE.md) se implementa un
 * `q10Provider.real.js` con esta misma interfaz y se cambia el import en
 * `usuarios.service.js`, sin tocar controller ni repository.
 *
 * @typedef {Object} CuentaQ10
 * @property {string} codigo_institucional_q10
 * @property {string} correo
 * @property {string} nombres
 * @property {string} apellidos
 * @property {'estudiante'|'docente'} rol
 * @property {string} [programa] - Solo aplica si rol es 'estudiante'.
 *
 * @interface Q10Provider
 * getRoster(): Promise<CuentaQ10[]>
 * findByCodigo(codigo: string): Promise<CuentaQ10|null>
 */
module.exports = {};
