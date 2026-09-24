import { useState } from "react";
import { iniciales } from "../../lib/formato";

// Foto del estudiante o, si no hay (o no carga), sus iniciales.
export default function Avatar({ perfil, size = "w-9 h-9", texto = "font-label-md text-label-md" }) {
  const [fallo, setFallo] = useState(false);
  if (perfil.foto_url && !fallo) {
    return (
      <img
        src={perfil.foto_url}
        alt={`Foto de ${perfil.nombres}`}
        onError={() => setFallo(true)}
        className={`${size} rounded-full object-cover bg-surface-container-high shrink-0`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0 ${texto}`}>
      {iniciales(perfil.nombres, perfil.apellidos)}
    </div>
  );
}
