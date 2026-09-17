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
  - ✅ Frontend inicializado en `/frontend` (Vite + React + Tailwind v3 +
    react-router-dom + axios). Tokens de diseño (colores, tipografía Inter,
    spacing, radios) configurados en `tailwind.config.js` a partir del
    `DESIGN.md` de los mockups de Stitch, con los mismos nombres de clase para
    poder portar el maquetado HTML directo a JSX.
  - ✅ Mockups extraídos en `docs/mockups_extracted/maquetado/` (uno por rol:
    autenticacion, empresas, docentes, modulo usuario (estudiante), Logo y
    estilo). Cada pantalla trae `code.html` (maquetado Tailwind) + `screen.png`.
  - ✅ Router base (`src/router/AppRouter.jsx`) con placeholders para las 6
    pantallas de autenticación: `/login` (Q10, CU-01/20/23/26),
    `/empresas/login` (CU-12/13), `/empresas/registro` (CU-11),
    `/empresas/pendiente`, `/empresas/rechazada` (CU-13/27), `/auth/callback`.
  - ✅ Las 6 pantallas de autenticación están convertidas a componentes React
    reales (no placeholders): Iniciar sesión Q10, Login empresa (+ modal de
    recuperación CU-13), Registro de empresa (validación de fuerza de
    contraseña), Cuenta pendiente, Cuenta rechazada (+ recuperación CU-13),
    Transición/error Q10 (con countdown y simulación de error). Interactividad
    migrada de scripts vanilla JS del mockup a `useState`/`useEffect` de React.
    Layout compartido en `src/components/layout/` (Header, Footer, AuthLayout).
  - 🔜 Siguiente paso: conectar los formularios a un backend real (por ahora
    los `onSubmit` solo simulan la respuesta con `TODO` marcados en el código:
    login/registro/recuperación de empresa, y el redirect real a Q10 SAML).
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
