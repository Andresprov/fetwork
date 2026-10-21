/**
 * Contrato de los proveedores de almacenamiento de archivos (foto de perfil y
 * hoja de vida adjunta). Hay dos implementaciones:
 * - `almacenamiento.local.js`: disco del backend (desarrollo / instancia unica).
 * - `almacenamiento.cloudinary.js`: Cloudinary (produccion en Render/Railway,
 *   donde el disco se borra en cada despliegue).
 *
 * `index.js` guarda con el proveedor activo (ALMACENAMIENTO=local|cloudinary)
 * y resuelve leer/eliminar/urlPublica segun el prefijo de la referencia, asi
 * que los archivos guardados con un proveedor siguen funcionando despues de
 * cambiar al otro.
 *
 * Lo que se guarda en la BD es la `referencia` que devuelve `guardar`; para
 * mostrarla siempre se pasa por `urlPublica`. Los archivos `privado` (hojas de
 * vida) no tienen URL publica: solo se leen desde el backend, que decide quien
 * puede descargarlos.
 *
 * @interface ProveedorAlmacenamiento
 * esPropia(referencia: string|null): boolean
 * guardar(buffer: Buffer, opciones: { carpeta: string, extension: string, privado?: boolean }): Promise<string>  // referencia
 * leer(referencia: string|null): Promise<Buffer|null>  // null si no existe o no es suya
 * eliminar(referencia: string): Promise<void>  // ignora referencias que no son suyas
 * urlPublica(referencia: string|null): string|null  // null si es privado
 */
module.exports = {};
