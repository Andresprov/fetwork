# FETWork V1.0 — Contexto del proyecto

> Este archivo es leído automáticamente por Claude Code al abrir este repo.
> Mantenlo actualizado a medida que avancen las fases.

## Qué es FETWork

Plataforma web de la Fundación Escuela Tecnológica de Neiva (FET) que conecta
el perfil profesional de estudiantes con empresas interesadas en su talento.
Proyecto académico de Ingeniería de Software II, cronograma de 11 semanas /
7 sprints, con entrega hasta mediados de noviembre de 2026.

Roles: **Estudiante**, **Empresa**, **Docente** (auditor), **Coordinador de
Pasantías**, **Validador de Empresas**. Docentes/Coordinador/Validador NO son
cuentas separadas: son docentes de Q10 con permisos adicionales asignados.

## Stack tecnológico (decidido, no renegociar sin razón fuerte)

| Componente | Tecnología |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express (patrón controllers/services/repositories) |
| ORM | Prisma |
| Base de datos | PostgreSQL (Neon o Supabase, plan gratuito) |
| Autenticación | Dos flujos: Q10 (SSO, estudiantes/docentes) + JWT/bcrypt (empresas) |
| Archivos (hoja de vida) | Cloudinary o almacenamiento local |
| Generación de documentos | docxtemplater (Node.js) — hoja de vida institucional PA-GTH-F-10 |
| Despliegue | Render o Railway (instancia única) |

## Arquitectura

- **Monolito modular** en 3 capas (presentación, lógica de negocio, datos).
  Se descartó microservicios por tiempo/equipo reducido.
- Módulos por dominio: Usuarios, Perfiles, Proyectos, Empresas, Administración.
  Cada uno es un router de Express independiente, activable/desactivable por
  config o variables de entorno.
- Los módulos NO se acceden entre sí directamente a la BD; todo pasa por
  servicios con interfaz definida.
- **Versionado interno por módulo**: cada módulo tiene una "versión en línea"
  (desarrollo activo) y una "versión de respaldo" (última estable, congelada).
  Se cambia manualmente vía config/env si la versión en línea falla.
  - Mejora futura (fuera de alcance V1.0): automatizar con Circuit Breaker
    (librería `opossum` para Node.js).
- Autenticación: estudiantes/docentes vía Q10 (SSO, sin password propio en
  FETWork); empresas se registran localmente (JWT + bcrypt), quedan en estado
  "pendiente" hasta ser validadas.

## Modelo de datos (ERD) — 12+ entidades

`usuarios`, `programas_academicos`, `estudiantes`, `empresas`,
`categorias_habilidades`, `habilidades`, `estudiante_habilidades`,
`experiencias`, `certificaciones`, `proyectos`, `proyecto_tecnologias`,
`proyecto_enlaces`, `datos_personales_cv`, `titulos_academicos`,
`actividades_investigativas`, `referencias`, `asignaciones_administrativas`,
`auditorias`, `vacantes`.

Detalle completo de campos y descripciones: ver `Arquitectura_FETWork_v1.1.docx`
sección 7.2 (cópialo a este repo, p. ej. en `/docs`).

Notas importantes:
- Datos de `datos_personales_cv`, `titulos_academicos`, `actividades_investigativas`,
  `referencias` son **privados**: nunca se muestran en perfil público ni en
  resultados de búsqueda de empresas, sin importar la config de visibilidad.
- `vacantes` es 1 a N con `empresas`. No hay flujo de postulación dentro de la
  plataforma en V1.0 — el campo `contacto` es el mecanismo de aplicación.

## Casos de uso (28 totales, CU-01 a CU-28)

Ver tabla completa en `Arquitectura_FETWork_v1.1.docx` sección 8.6.
Puntos clave a no olvidar:
- **CU-16 y CU-17 (Empresa) NO tienen pantalla propia**: reutilizan la pantalla
  de CU-07 (vista pública del perfil del estudiante). No maquetar/desarrollar
  vista adicional para estos dos.
- CU-18 = Publicar vacante, CU-19 = Gestionar mis vacantes publicadas
  (hubo una inversión de nombres en los mockups que ya fue corregida).

## Estado del proyecto (actualizar conforme avance)

- ✅ Fase 2 — Product Backlog: `Product_Backlog_FETWork.xlsx` (HU-01 a HU-24,
  criterios de aceptación, prioridad, sprints).
- ✅ Fase 3 — Arquitectura y diseño: `Arquitectura_FETWork_v1.1.docx`
  (arquitectura, stack, ERD, diccionario de datos, casos de uso, trazabilidad RF).
- ✅ Mockups: 26 pantallas (estudiante, empresa, docente/roles administrativos,
  autenticación e identidad visual) — validadas contra arquitectura y requisitos.
- 🔜 **Fase 4 (actual)**: desarrollo, siguiendo el cronograma de 7 sprints
  (`cronograma.xlsx`). Sprint 1 = Gestión de usuarios (autenticación Q10 y
  empresas).
  - ✅ **Acta de Reunión No. 003 — "proyecto base funcionando"**: backend +
    frontend + base de datos conectados de punta a punta (backend/frontend
    arrancan sin errores, login Q10 mock y registro/login de empresa
    funcionan de extremo a extremo en la interfaz real). Detalle abajo.
  - ✅ **Backend** (`/backend`, Express 5 + Prisma 7.10.0):
    - `prisma/schema.prisma` con las 19 entidades del ERD (sección 7.2 del
      docx de arquitectura) + una tabla auxiliar `password_reset_tokens`
      (infraestructura de auth para CU-13, no es entidad de negocio del ERD).
    - Prisma 7 cambia el flujo de conexión respecto a versiones previas: la
      URL va en `prisma.config.ts` (no en el `datasource` de schema.prisma,
      como ya indicaba este archivo) y además exige un *driver adapter*
      explícito (`@prisma/adapter-pg`) en el `PrismaClient`. El cliente
      generado (`generator client { provider = "prisma-client" }`) se emite
      como TypeScript/ESM puro sin `index.js` compilado, así que el backend
      corre con `tsx` (`npm run dev` / `npm run start`) en vez de `node`
      directo — no es un cambio de stack, solo de runtime de ejecución.
    - Estructura de módulos `src/modules/{usuarios,perfiles,proyectos,
      empresas,administracion}/` (routes/controller/service/repository).
      `usuarios` y `empresas` completos; `perfiles`, `proyectos` y
      `administracion` son esqueletos (501, listos para Sprint 2+).
    - `usuarios`: proveedor Q10 **mock** tras una interfaz
      (`providers/q10Provider.interface.js` + `.mock.js`) con roster fijo de
      3 estudiantes y 2 docentes de prueba. `GET /api/usuarios/q10/roster` y
      `POST /api/usuarios/q10/login` simulan el selector de cuentas y el
      callback SSO; hacen upsert real en `usuarios`/`estudiantes` y devuelven
      JWT propio de FETWork. Sustituir por la integración real solo requiere
      un nuevo archivo `q10Provider.real.js` con la misma interfaz.
    - `empresas`: `POST /registro` (JWT+bcrypt, queda `estado_validacion =
      'pendiente'`), `POST /login` (devuelve `estado` pendiente/rechazada/
      aprobada), `POST /recuperar-contrasena` y `POST /resetear-contrasena`
      (CU-13, token real de un solo uso en `password_reset_tokens`; el envío
      de correo queda simulado con `console.log` del enlace).
    - `src/config/modulos.config.js`: flags por variable de entorno para
      activar/desactivar cada módulo. El versionado interno "en línea /
      respaldo" (sección 5.2) queda preparado a nivel de config pero **sin**
      una segunda implementación paralela todavía (fuera de alcance Sprint 1).
    - `GET /api/health` (backend + estado real de conexión a Prisma) y
      middleware de errores global (un módulo no controlado no tumba a los
      demás).
  - ✅ **Frontend** (`/frontend`, Vite + React + Tailwind v3 + react-router-dom
    + axios). Tokens de diseño en `tailwind.config.js` desde el `DESIGN.md`
    de los mockups. Las 6 pantallas de autenticación (Iniciar sesión Q10,
    Login empresa + modal recuperación CU-13, Registro de empresa con
    checklist de fuerza de contraseña, Cuenta pendiente, Cuenta rechazada +
    recuperación CU-13, Transición/error Q10 con countdown) están conectadas
    a los endpoints reales del backend vía `src/api/{client,auth}.js` — ya no
    simulan la respuesta. Único TODO que queda intacto a propósito: el
    redirect real a Q10 SAML (`IniciarSesionQ10.jsx` usa el roster mock en su
    lugar, ya que no hay acceso real a Q10 todavía).
  - ✅ **Base de datos**: `backend/.env` (gitignored) tiene la `DATABASE_URL`
    (pooled) y `DIRECT_URL` (sin pooler) reales de Neon. Prisma 7 ya no
    admite `url`/`directUrl` dentro del bloque `datasource` de
    `schema.prisma` (error P1012 "no longer supported in schema files");
    ambas viven en `prisma.config.ts`: `datasource.url` usa `DIRECT_URL`
    (la usa el CLI para `migrate`/`introspect`), mientras que el runtime de
    la app usa `DATABASE_URL` (pooled) a través del `@prisma/adapter-pg`
    instanciado en `src/lib/prisma.js` — son dos mecanismos independientes.
    `npx prisma migrate dev --name init` se corrió contra Neon: las 19
    tablas del ERD + `password_reset_tokens` (21 tablas con
    `_prisma_migrations`) quedaron creadas sin errores. Verificado
    end-to-end con curl contra el backend real: roster y login Q10 (mock)
    hacen upsert real en `usuarios`/`estudiantes`; registro de empresa crea
    fila en `usuarios`+`empresas` con `estado_validacion='pendiente'`; login
    de empresa devuelve el estado correcto (pendiente/rechazada/aprobada);
    recuperar/resetear contraseña genera y valida un token real end-to-end.
- Fases 5–12: pendientes según cronograma, hasta mediados de noviembre 2026.

## Documentos de referencia (cópialos a `/docs` en este repo)

- `Arquitectura_FETWork_v1.1.docx` — arquitectura completa
- `Product_Backlog_FETWork.xlsx` — historias de usuario
- `cronograma.xlsx` — cronograma de sprints
- `Trazabilidad_FETWork_RF_CU_Pantallas.xlsx` — trazabilidad RF ↔ CU ↔ pantallas
- Mockups (zip por rol: estudiante, empresa, docente/admin, autenticación)

## Cómo trabajar en este repo

- Ir módulo por módulo, empezando por autenticación (Sprint 1).
- Antes de codificar una pantalla, revisar su mockup correspondiente y el CU
  asociado en la trazabilidad.
- Mantener el patrón controllers/services/repositories en el backend y
  componentes reutilizables en el frontend (Tailwind, sin librerías de UI pesadas
  salvo que se decida lo contrario).
- Actualizar la sección "Estado del proyecto" de este archivo al cerrar cada fase/sprint.
