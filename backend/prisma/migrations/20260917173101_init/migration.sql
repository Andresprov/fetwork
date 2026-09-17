-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('estudiante', 'docente', 'empresa');

-- CreateEnum
CREATE TYPE "OrigenAutenticacion" AS ENUM ('q10', 'local');

-- CreateEnum
CREATE TYPE "EstadoValidacionEmpresa" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "NivelTitulo" AS ENUM ('pregrado', 'tecnologo', 'tecnico', 'especializacion', 'maestria');

-- CreateEnum
CREATE TYPE "TipoActividadInvestigativa" AS ENUM ('grupo_investigacion', 'proyecto', 'tutoria', 'jurado', 'publicacion', 'ponencia', 'organizacion');

-- CreateEnum
CREATE TYPE "TipoReferencia" AS ENUM ('familiar', 'personal');

-- CreateEnum
CREATE TYPE "TipoAsignacionAdministrativa" AS ENUM ('coordinador_pasantias', 'validador_empresas');

-- CreateEnum
CREATE TYPE "TipoVacante" AS ENUM ('pasantia', 'empleo');

-- CreateEnum
CREATE TYPE "EstadoVacante" AS ENUM ('activa', 'cerrada');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "codigo_institucional_q10" TEXT,
    "correo" TEXT NOT NULL,
    "contrasena_hash" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "origen_autenticacion" "OrigenAutenticacion" NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "programas_academicos" (
    "id_programa" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "programas_academicos_pkey" PRIMARY KEY ("id_programa")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id_estudiante" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_programa" INTEGER NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "semestre" INTEGER,
    "telefono" TEXT,
    "foto_url" TEXT,
    "hoja_vida_url" TEXT,
    "portafolio_url" TEXT,
    "github_url" TEXT,
    "mostrar_experiencia" BOOLEAN NOT NULL DEFAULT true,
    "mostrar_certificaciones" BOOLEAN NOT NULL DEFAULT true,
    "mostrar_proyectos" BOOLEAN NOT NULL DEFAULT true,
    "mostrar_contacto" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id_empresa" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre_empresa" TEXT NOT NULL,
    "descripcion" TEXT,
    "sector" TEXT,
    "sitio_web" TEXT,
    "telefono" TEXT,
    "estado_validacion" "EstadoValidacionEmpresa" NOT NULL DEFAULT 'pendiente',
    "id_validador" INTEGER,
    "fecha_validacion" TIMESTAMP(3),
    "comentario_validacion" TEXT,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "categorias_habilidades" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "categorias_habilidades_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id_habilidad" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id_habilidad")
);

-- CreateTable
CREATE TABLE "estudiante_habilidades" (
    "id_estudiante" INTEGER NOT NULL,
    "id_habilidad" INTEGER NOT NULL,
    "nivel" TEXT,

    CONSTRAINT "estudiante_habilidades_pkey" PRIMARY KEY ("id_estudiante","id_habilidad")
);

-- CreateTable
CREATE TABLE "experiencias" (
    "id_experiencia" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "cargo" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "jefe_inmediato" TEXT,
    "dedicacion" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "descripcion" TEXT,

    CONSTRAINT "experiencias_pkey" PRIMARY KEY ("id_experiencia")
);

-- CreateTable
CREATE TABLE "certificaciones" (
    "id_certificacion" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "entidad_emisora" TEXT,
    "fecha" TIMESTAMP(3),
    "duracion" TEXT,
    "modalidad" TEXT,

    CONSTRAINT "certificaciones_pkey" PRIMARY KEY ("id_certificacion")
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id_proyecto" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3),
    "repositorio_github_url" TEXT,

    CONSTRAINT "proyectos_pkey" PRIMARY KEY ("id_proyecto")
);

-- CreateTable
CREATE TABLE "proyecto_tecnologias" (
    "id_tecnologia" SERIAL NOT NULL,
    "id_proyecto" INTEGER NOT NULL,
    "tecnologia" TEXT NOT NULL,

    CONSTRAINT "proyecto_tecnologias_pkey" PRIMARY KEY ("id_tecnologia")
);

-- CreateTable
CREATE TABLE "proyecto_enlaces" (
    "id_enlace" SERIAL NOT NULL,
    "id_proyecto" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT,

    CONSTRAINT "proyecto_enlaces_pkey" PRIMARY KEY ("id_enlace")
);

-- CreateTable
CREATE TABLE "datos_personales_cv" (
    "id_datos_personales" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "documento_identidad" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "lugar_nacimiento" TEXT,
    "estado_civil" TEXT,
    "lugar_residencia" TEXT,
    "direccion" TEXT,
    "rh" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_telefono" TEXT,

    CONSTRAINT "datos_personales_cv_pkey" PRIMARY KEY ("id_datos_personales")
);

-- CreateTable
CREATE TABLE "titulos_academicos" (
    "id_titulo" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "nivel" "NivelTitulo" NOT NULL,
    "fecha_grado" TIMESTAMP(3),
    "institucion" TEXT,
    "pais_ciudad" TEXT,
    "titulo_obtenido" TEXT NOT NULL,
    "modalidad_estudio" TEXT,

    CONSTRAINT "titulos_academicos_pkey" PRIMARY KEY ("id_titulo")
);

-- CreateTable
CREATE TABLE "actividades_investigativas" (
    "id_actividad" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "tipo" "TipoActividadInvestigativa" NOT NULL,
    "descripcion" TEXT,
    "periodo" TEXT,

    CONSTRAINT "actividades_investigativas_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "referencias" (
    "id_referencia" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "tipo" "TipoReferencia" NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "profesion_ocupacion" TEXT,
    "parentesco" TEXT,
    "telefono" TEXT,

    CONSTRAINT "referencias_pkey" PRIMARY KEY ("id_referencia")
);

-- CreateTable
CREATE TABLE "asignaciones_administrativas" (
    "id_asignacion" SERIAL NOT NULL,
    "id_docente" INTEGER NOT NULL,
    "tipo" "TipoAsignacionAdministrativa" NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignaciones_administrativas_pkey" PRIMARY KEY ("id_asignacion")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id_auditoria" SERIAL NOT NULL,
    "id_docente" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "asignado_por" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateTable
CREATE TABLE "vacantes" (
    "id_vacante" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "tipo" "TipoVacante" NOT NULL,
    "descripcion" TEXT,
    "requisitos" TEXT,
    "modalidad" TEXT,
    "fecha_limite" TIMESTAMP(3),
    "estado" "EstadoVacante" NOT NULL DEFAULT 'activa',
    "fecha_publicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contacto" TEXT NOT NULL,

    CONSTRAINT "vacantes_pkey" PRIMARY KEY ("id_vacante")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigo_institucional_q10_key" ON "usuarios"("codigo_institucional_q10");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_id_usuario_key" ON "estudiantes"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_id_usuario_key" ON "empresas"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "datos_personales_cv_id_estudiante_key" ON "datos_personales_cv"("id_estudiante");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_programa_fkey" FOREIGN KEY ("id_programa") REFERENCES "programas_academicos"("id_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_validador_fkey" FOREIGN KEY ("id_validador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades" ADD CONSTRAINT "habilidades_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_habilidades"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_habilidades" ADD CONSTRAINT "estudiante_habilidades_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiante_habilidades" ADD CONSTRAINT "estudiante_habilidades_id_habilidad_fkey" FOREIGN KEY ("id_habilidad") REFERENCES "habilidades"("id_habilidad") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencias" ADD CONSTRAINT "experiencias_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificaciones" ADD CONSTRAINT "certificaciones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecto_tecnologias" ADD CONSTRAINT "proyecto_tecnologias_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyectos"("id_proyecto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proyecto_enlaces" ADD CONSTRAINT "proyecto_enlaces_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "proyectos"("id_proyecto") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "datos_personales_cv" ADD CONSTRAINT "datos_personales_cv_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titulos_academicos" ADD CONSTRAINT "titulos_academicos_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_investigativas" ADD CONSTRAINT "actividades_investigativas_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referencias" ADD CONSTRAINT "referencias_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_administrativas" ADD CONSTRAINT "asignaciones_administrativas_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_id_docente_fkey" FOREIGN KEY ("id_docente") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_asignado_por_fkey" FOREIGN KEY ("asignado_por") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacantes" ADD CONSTRAINT "vacantes_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
