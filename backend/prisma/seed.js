// Datos base del catalogo: categorias de habilidades y habilidades.
// Idempotente: se puede correr varias veces sin duplicar registros.
// Uso: npm run prisma:seed
require("dotenv/config");
const prisma = require("../src/lib/prisma");

const CATALOGO = {
  "Tecnologías y Lenguajes": [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "HTML y CSS",
    "React", "Angular", "Vue.js", "Node.js", "Express", "Spring Boot", ".NET",
    "Django", "Flutter", "Kotlin", "Swift", "Tailwind CSS",
  ],
  "Bases de Datos": ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB", "Firebase", "Redis"],
  "Infraestructura y DevOps": ["Git y GitHub", "Docker", "Linux", "AWS", "Azure", "Google Cloud", "CI/CD", "Redes y Telecomunicaciones"],
  "Metodologías y Prácticas": ["Scrum", "Kanban", "Pruebas de software", "UML", "Arquitectura de software", "Diseño UX/UI", "Análisis de datos"],
  "Habilidades Blandas": [
    "Trabajo en equipo", "Comunicación asertiva", "Liderazgo", "Resolución de problemas",
    "Pensamiento analítico", "Gestión del tiempo", "Adaptabilidad", "Aprendizaje autónomo",
  ],
  Idiomas: ["Español", "Inglés", "Francés", "Portugués", "Alemán"],
};

// Los primeros logins Q10 crearon programas sin tildes; se normalizan para
// que la sincronizacion reutilice el mismo registro.
const PROGRAMAS_NORMALIZADOS = {
  "Ingenieria de Software": "Ingeniería de Software",
  "Tecnologia en Desarrollo de Software": "Tecnología en Desarrollo de Software",
};

async function normalizarProgramas() {
  for (const [anterior, nuevo] of Object.entries(PROGRAMAS_NORMALIZADOS)) {
    const viejo = await prisma.programaAcademico.findFirst({ where: { nombre: anterior } });
    if (!viejo) continue;
    const vigente = await prisma.programaAcademico.findFirst({ where: { nombre: nuevo } });
    if (vigente) {
      await prisma.estudiante.updateMany({ where: { id_programa: viejo.id_programa }, data: { id_programa: vigente.id_programa } });
      await prisma.programaAcademico.delete({ where: { id_programa: viejo.id_programa } });
    } else {
      await prisma.programaAcademico.update({ where: { id_programa: viejo.id_programa }, data: { nombre: nuevo } });
    }
  }
}

async function sembrarCatalogo() {
  let creadas = 0;
  for (const [nombreCategoria, habilidades] of Object.entries(CATALOGO)) {
    let categoria = await prisma.categoriaHabilidad.findFirst({ where: { nombre: nombreCategoria } });
    if (!categoria) categoria = await prisma.categoriaHabilidad.create({ data: { nombre: nombreCategoria } });

    for (const nombre of habilidades) {
      const existe = await prisma.habilidad.findFirst({ where: { nombre, id_categoria: categoria.id_categoria } });
      if (!existe) {
        await prisma.habilidad.create({ data: { nombre, id_categoria: categoria.id_categoria } });
        creadas += 1;
      }
    }
  }
  return creadas;
}

async function main() {
  await normalizarProgramas();
  const creadas = await sembrarCatalogo();
  console.log(`Seed completado. Habilidades nuevas: ${creadas}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
