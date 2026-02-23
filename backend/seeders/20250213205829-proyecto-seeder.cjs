"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("proyecto", [
      {
        id_proyecto: 1,
        titulo: "Mailing corporativos para KrönenVet y Otros Clientes",
        descripcion: "Diseño y desarrollo de campañas de mailing altamente efectivas utilizando MJML para garantizar compatibilidad total en gestores de correo. Implementación de maquetación pixel-perfect con HTML y CSS, optimizadas para móviles. Se aplicaron las mejores prácticas de marketing digital, incluyendo ganchos de conversión, llamadas a la acción claras (CTAs), y estructuras visuales con jerarquías pensadas para maximizar el CTR (Click-Through Rate).",
        fecha_inicio: new Date("2023-08-10"),
        fecha_fin: new Date("2023-11-20"),
        enlace: null,
        imagen_pastilla: "3.png",
        max_imagenes: 5
      },
      {
        id_proyecto: 2,
        titulo: "Prototipado de ventanas en figma",
        descripcion: "Exploración y diseño de interfaces interactivas para aplicaciones web y móviles. Creación de flujos de usuario detallados, wireframes de alta fidelidad y prototipos navegables en Figma. El enfoque se centró en la arquitectura de la información y la usabilidad, permitiendo validar la experiencia del usuario antes de la etapa de desarrollo. Se establecieron variables de diseño y componentes maestros para mantener consistencia visual.",
        fecha_inicio: new Date("2023-03-05"),
        fecha_fin: new Date("2023-05-15"),
        enlace: null,
        imagen_pastilla: "pastilla2.png",
        max_imagenes: 5
      }
    ], {
      updateOnDuplicate: ["titulo", "descripcion", "fecha_inicio", "fecha_fin", "enlace", "imagen_pastilla", "max_imagenes"]
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("proyecto", null, {});
  }
};
