/**
 * Contrato de los proveedores de almacenamiento de archivos (foto de perfil y,
 * mas adelante, otros adjuntos). Hoy se usa `almacenamiento.local.js` (disco
 * del backend, servido en /uploads). Para Cloudinary se implementa un
 * `almacenamiento.cloudinary.js` con esta misma interfaz y se cambia el
 * require en `index.js`, sin tocar servicios ni controllers.
 *
 * Lo que se guarda en la BD es la `referencia` que devuelve `guardar`; para
 * mostrarla siempre se pasa por `urlPublica`.
 *
 * @interface ProveedorAlmacenamiento
 * guardar(buffer: Buffer, opciones: { carpeta: string, extension: string }): Promise<string>  // referencia
 * leer(referencia: string|null): Promise<Buffer|null>  // null si no existe o no es suya
 * eliminar(referencia: string): Promise<void>  // ignora referencias que no son suyas
 * urlPublica(referencia: string|null): string|null
 */
module.exports = {};
