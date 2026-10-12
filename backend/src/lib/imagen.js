const sharp = require("sharp");

// Normaliza una foto de perfil: aplica la rotacion EXIF (las fotos de celular
// vienen "acostadas" con una marca de orientacion que no todos los visores
// respetan), la reduce a un maximo de 800 px y la convierte a JPEG sin
// metadatos (el EXIF puede incluir la ubicacion GPS donde se tomo la foto).
// Lanza si el archivo no es una imagen valida.
async function normalizarFoto(buffer) {
  const { data, info } = await sharp(buffer)
    .rotate()
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  return { buffer: data, ancho: info.width, alto: info.height };
}

module.exports = { normalizarFoto };
