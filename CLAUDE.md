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
      `usuarios`, `empresas` y `perfiles` completos; `proyectos` solo expone
      una lectura interna para la vista publica y `administracion` sigue
      como esqueleto (501).
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
  - ✅ **Sprint 2 — Módulo de Perfiles (CU-02, CU-03, CU-06, CU-07)**:
    - Backend `src/modules/perfiles/` (routes/controller/service/repository)
      bajo `/api/perfiles`. Middleware `src/middleware/auth.js`
      (`requireAuth` + `requireRol`) sobre el JWT emitido en el login Q10;
      todo `/me*` exige rol `estudiante` y cada consulta de escritura filtra
      por `id_estudiante` (un estudiante no puede tocar filas de otro:
      responde 404).
      - `GET/PUT /me`: el PUT solo acepta `telefono`, `foto_url`,
        `hoja_vida_url`, `portafolio_url`, `github_url` (URLs http/https
        validadas); cualquier otro campo (nombres, apellidos, programa,
        semestre) se rechaza con 400 porque vienen de Q10.
      - `GET /habilidades/catalogo` (público), `GET/POST /me/habilidades`,
        `DELETE /me/habilidades/:idHabilidad`. Nivel opcional:
        `basico | intermedio | avanzado`. El POST hace upsert.
      - CRUD `/me/experiencias` y `/me/certificaciones` (fechas AAAA-MM-DD,
        fin >= inicio).
      - `PUT /me/visibilidad`: los 4 toggles, solo booleanos.
      - `GET /:idEstudiante/publico` (sin sesión): lista blanca de campos.
        Siempre visibles: nombre, programa, semestre, foto y habilidades.
        `mostrar_experiencia` → experiencias SIN teléfono/dirección/jefe
        inmediato; `mostrar_certificaciones` → certificaciones;
        `mostrar_proyectos` → proyectos + enlaces GitHub/portafolio;
        `mostrar_contacto` → correo, teléfono y enlace de hoja de vida.
        `datos_personales_cv`, `titulos_academicos`,
        `actividades_investigativas` y `referencias` nunca se consultan.
      - Los proyectos se leen vía `proyectos.service.listarPublicosPorEstudiante`
        (sin acceso directo entre módulos).
      - `prisma/seed.js` (`npm run prisma:seed`, idempotente): catálogo de
        6 categorías / 54 habilidades, y normaliza con tildes los nombres de
        programas creados en Sprint 1. Ya se corrió contra Neon.
      - El proveedor Q10 simulado ahora incluye `semestre` y lo sincroniza
        en cada login.
    - Frontend: `src/components/layout/EstudianteLayout.jsx` (cabecera
      verde con navegación por secciones y cierre de sesión, basada en los
      mockups de `docs/mockups_extracted/.../modulo usuario (estudiante)`),
      guarda `src/router/RequireEstudiante.jsx`, componentes compartidos en
      `src/components/ui/` y pantallas en `src/pages/perfil/` (Resumen,
      Datos personales, Habilidades, Experiencia, Certificaciones,
      Visibilidad, Vista pública). `src/components/perfil/PerfilPublicoView.jsx`
      es la ÚNICA vista pública: la usa la vista previa del estudiante
      (`/perfil/vista-publica`, marca secciones ocultas) y el enlace
      público `/perfiles/:idEstudiante` (omite secciones ocultas o vacías),
      que es el que reutilizará la empresa en CU-16/CU-17. El cliente axios
      adjunta el JWT y cierra sesión ante un 401. El login Q10 de un
      estudiante redirige a `/perfil`.
    - Verificado: script de API (38 chequeos: auth 401/403, scope entre
      estudiantes, validaciones, visibilidad y ausencia de datos privados) y
      recorrido end-to-end en navegador headless (Edge) — login Q10, editar
      datos, agregar/quitar habilidades, crear/editar experiencia,
      crear/eliminar certificación, ocultar experiencia y contacto, y
      confirmar que el enlace público respeta la configuración (23/23). Los
      datos de prueba se limpiaron después.
    - Convención de UI: los textos visibles no llevan referencias internas
      (CU-xx, Sprint N, "mock"); esas referencias van solo en comentarios
      del código.
  - ✅ **Sprint 3 — Proyectos y hoja de vida PA-GTH-F-10 (CU-04, CU-05,
    CU-08, CU-09)**. Sin cambios de esquema: el ERD ya tenía todas las tablas.
    - `src/lib/validacion.js`: validadores compartidos (`crearValidadores`
      con mapa de etiquetas + `idEntero`); `perfiles.service` se refactorizó
      para usarlos.
    - Backend `proyectos` (`/api/proyectos/me`, solo rol estudiante): CRUD
      con tecnologías (lista de strings, máx. 20, sin duplicados) y enlaces
      (`demo | video | documentacion | articulo | otro`, máx. 10); en cada
      edición se reemplazan completas (transacción). `repositorio_github_url`
      solo acepta github.com. Resuelve el estudiante vía
      `perfiles.service.obtenerIdEstudiante` (require diferido para evitar la
      dependencia circular con perfiles).
    - Backend hoja de vida (dentro del módulo perfiles, archivos
      `hojaVida.*`): `GET /api/perfiles/me/hoja-vida` (todo + completitud por
      paso), `PUT .../datos-personales` (upsert parcial, RH/estado civil de
      lista cerrada, mayor de 14 años), CRUD `.../titulos`, `.../actividades`,
      `.../referencias` (parentesco obligatorio solo en familiares; teléfono
      obligatorio) y `GET .../exportar` (PDF). La experiencia
      laboral y los cursos reutilizan `experiencias` y `certificaciones`
      (sección 7.3).
    - Generación con docxtemplater sobre el **formato oficial** de Talento
      Humano (`backend/templates/plantilla_hoja_vida_PA-GTH-F-10.docx`,
      versión 01 del 23/06/2018 — nunca se edita a mano y es el ÚNICO .docx
      del repo). `hojaVida.plantilla.js` lo lee y le inserta los marcadores
      en memoria (cacheado; no se guarda copia derivada) y
      `hojaVida.documento.js` lo rellena. Cada párrafo tocado se valida por
      su texto: si llega otra versión del formato, falla con un mensaje claro.
    - **Salida en PDF** (decisión del usuario, 12/10/2026): el .docx relleno
      se convierte con LibreOffice headless (`soffice --convert-to pdf`;
      ruta configurable con `LIBREOFFICE_PATH`, por defecto la instalación
      estándar). Perfil de LibreOffice reutilizado y conversiones en cola
      (~4–5 s por PDF). Para Render/Railway se despliega con
      `backend/Dockerfile`, que instala `libreoffice-writer-nogui` + fuentes
      métricamente compatibles con Arial/Calibri.
      Decisiones de mapeo (acordadas con el usuario):
      - El programa en curso en la FET va en el bloque **Pregrado** como
        «En curso (semestre N)» (el formato no tiene "formación en curso").
      - Títulos agrupados por nivel en los bloques fijos del formato
        (2.1 Maestría/Especialización/Pregrado, 2.2 Tecnólogo/Técnico);
        nivel sin títulos → «No registra». Cursos = tabla de diplomados
        (fecha MM/AAAA porque la columna es angosta).
      - Experiencia: un bloque completo (con INSTITUCIÓN/EMPRESA) que se
        repite por experiencia.
      - Sección 4: subsecciones por tipo de actividad. Sin cambios de
        esquema: todas las tutorías van en «pregrado» y 4.5 «Trabajos e
        informes técnicos» queda «No registra» (no hay tipo en el enum).
      - Recuadro de foto: lleva la foto de perfil del estudiante (si la
        subió). docxtemplater no inserta imágenes sin módulo de pago, así que
        `hojaVida.documento.js` la agrega tras renderizar: la ancla detrás
        del «Rectángulo 13» del formato, con su posición/tamaño leídos del
        propio XML, recortada tipo "cover". Sin foto, el recuadro queda vacío.
      - Fecha: la «FECHA: 23/06/2018» del encabezado es la de aprobación de
        la versión 01 del formato (control documental) y NO se cambia
        (decisión del usuario, 12/10/2026). La fecha del día va aparte como
        «Fecha de diligenciamiento: dd/mm/aaaa» debajo de la firma, en hora
        de Colombia (America/Bogota).
      - Habilidades y declaración juramentada no están en el formato
        oficial: no salen en el documento.
      - Los saltos de página del formato se convirtieron en "salto de página
        antes" de cada sección para no generar hojas en blanco.
    - Frontend: `/perfil/proyectos` (portafolio con búsqueda por nombre o
      tecnología), `/perfil/proyectos/nuevo` y `/:id` (formulario con chips
      de tecnologías, enlaces y checklist de calidad), `/perfil/hoja-vida`
      (formulario de 5 pasos, `?paso=N`, con panel de completitud) y
      `/perfil/hoja-vida/exportar` (la vista previa es el mismo PDF embebido
      en un iframe, idéntico al descargado). La vista
      pública ahora muestra también los enlaces de cada proyecto.
    - Verificado: script de API (46 chequeos: auth, alcance entre
      estudiantes, validaciones, exportación y ausencia de datos privados en
      la vista pública), .docx revisado convertido a PDF, y recorrido E2E en
      Edge headless (40/40, vista móvil sin scroll horizontal). Datos de
      prueba limpiados. Tras el cambio a PDF se revisó el PDF generado y la
      descarga desde la pantalla en Edge headless.
  - ✅ **Foto de perfil como archivo** (adelantado del Sprint 4, 12/10/2026):
    `PUT /api/perfiles/me/foto` (multipart, campo `foto`, JPG/PNG/WEBP
    validado por firma, máx. 2 MB) y `DELETE /me/foto`. Con `sharp`
    (`src/lib/imagen.js`) se aplica la rotación EXIF, se reduce a máx.
    800 px y se guarda como JPEG sin metadatos (el EXIF puede traer GPS); `foto_url` ya no
    se acepta en `PUT /me`. Almacenamiento tras interfaz
    (`src/lib/almacenamiento/`, mismo patrón que el proveedor Q10): hoy
    `almacenamiento.local.js` guarda en `backend/uploads/` (gitignored),
    servido en `/uploads`; en BD queda la ruta relativa y el serializador
    la vuelve absoluta con `PUBLIC_URL`. Las URLs absolutas antiguas se
    devuelven tal cual. Al reemplazar o quitar la foto se borra el archivo
    anterior. En el frontend, Datos personales sube la foto al
    seleccionarla (Subir/Cambiar/Quitar).
  - ✅ **Sprint 4 — GitHub, portafolio y perfil público (21/10/2026)**. Las
    HU-14 a HU-17 (enlaces GitHub/portafolio, vista pública y visibilidad) ya
    estaban cubiertas por el Sprint 2; este sprint agregó:
    - **Sincronización con GitHub (CU-05)**, en el módulo proyectos:
      `providers/github.client.js` (API REST pública, sin OAuth; caché de 5
      min en memoria; `GITHUB_TOKEN` opcional sube el límite de 60 a 5000
      consultas/hora) y `service/github.service.js`. Rutas (antes de
      `/me/:id`): `GET /api/proyectos/me/github/repositorios` (repos públicos
      propios, sin forks, marcando los ya importados),
      `POST .../github/importar` (`{ repositorios: ["usuario/repo"] }`, máx.
      30; crea el proyecto con nombre, descripción, fecha de creación,
      lenguajes + topics como tecnologías y el homepage como demo; omite
      repos ajenos y ya importados, sin duplicar) y
      `GET .../github/repositorio?url=` (estrellas, forks, lenguajes, 3
      últimos commits). El usuario sale de `github_url`, que ahora debe ser
      un perfil `https://github.com/usuario` (400 si no).
    - **Hoja de vida en PDF** (distinta de la PA-GTH-F-10): `PUT/DELETE/GET
      /api/perfiles/me/hoja-vida-archivo` (multipart `hoja_vida`, firma
      `%PDF-`, máx. 5 MB) y `GET /api/perfiles/:id/hoja-vida-archivo`
      (pública solo con `mostrar_contacto`; registrada al final del router
      para no capturar `/me`). Se guarda como archivo **privado** en la misma
      columna `hoja_vida_url`; el perfil devuelve `hoja_vida_archivo: true` y
      la vista pública enlaza al endpoint. Un enlace escrito en Datos
      personales reemplaza (y borra) el PDF.
    - **Almacenamiento**: `lib/almacenamiento/index.js` es ahora una fachada
      que guarda con el proveedor activo (`ALMACENAMIENTO=local|cloudinary`)
      y despacha leer/eliminar/urlPublica por el prefijo de la referencia
      (`/uploads/...` o `cloudinary:<tipo>/<public_id>.<ext>`), así los
      archivos viejos siguen funcionando al cambiar. `almacenamiento.cloudinary.js`
      usa la API REST firmada sin SDK (`CLOUDINARY_URL`); fotos públicas
      (`upload`) y hojas de vida privadas (`private`, descargadas con
      petición firmada). La firma se validó contra el ejemplo de la
      documentación de Cloudinary, pero **no se ha probado contra una cuenta
      real** (no hay credenciales todavía). En local solo se sirve
      `/uploads/fotos`; `uploads/hojas-vida` no es accesible por URL.
    - **Hoja de vida PA-GTH-F-10**: nuevos tipos de actividad
      `tutoria_posgrado` e `informe_tecnico` (migración
      `20261021184325_tipos_actividad_hoja_vida`, aplicada en Neon) → llenan
      «Tutorías … de posgrado» y «4.5 Trabajos e informes técnicos». En
      `hojaVida.plantilla.js` se quitaron 3 de los 4 párrafos vacíos tras la
      tabla de cursos (dejaban un hueco arriba de 2.2) y todos los títulos
      (Título 1/2/3) llevan `keepNext` (4.5 ya no queda huérfano al pie).
      La etiqueta del tipo `organizacion` en la UI pasó a «Pertenencia a
      organizaciones» (así se llama 4.7 en el formato).
    - Frontend: botón «Sincronizar con GitHub» en el portafolio
      (`components/proyectos/ImportarGithubModal.jsx`), panel GitHub en el
      formulario de proyecto con «Completar con datos de GitHub»
      (`PanelGithub.jsx`, solo llena lo vacío y suma tecnologías) y bloque
      «Hoja de vida en PDF» en Datos personales (el formulario ahora envía
      solo los campos modificados). `api/client.js` expone `obtenerArchivo`
      para descargas de PDF.
    - Verificado: script de API (36 chequeos) y E2E en Edge headless (18,
      incluida vista móvil sin scroll horizontal) con Camilo y la cuenta
      pública `octocat`; datos de prueba restaurados.
- Fases 5–12: pendientes según cronograma, hasta mediados de noviembre 2026.
  - 🔜 Sprint 5 (31/10–6/11): módulo empresarial (búsqueda, vacantes
    CU-18/CU-19) **+ validación de empresas** (rol Validador de Empresas:
    aprobar/rechazar con comentario las empresas en «pendiente»; usa
    `estado_validacion`, `id_validador`, `fecha_validacion` y
    `comentario_validacion` de `empresas`). Se agregó al Sprint 5 del
    `cronograma.xlsx` el 21/10/2026 a pedido del usuario, porque sin
    validador ninguna empresa registrada puede entrar. El resto del módulo
    `administracion` (coordinador, auditoría docente) sigue sin sprint
    propio y en 501.

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
