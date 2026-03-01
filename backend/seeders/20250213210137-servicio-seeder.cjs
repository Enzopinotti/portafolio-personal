"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("servicio", [
      {
        id_servicio: 1,
        nombre: "Análisis de Datos (BI)",
        descripcion: "Diseño de dashboards interactivos, definición de KPIs y levantamiento de requerimientos para facilitar decisiones con Power BI y Excel.",
        precio: 600.00,
        id_imagen: null
      },
      {
        id_servicio: 2,
        nombre: "Desarrollo Web Full-Stack",
        descripcion: "Construcción de interfaces modernas (React, Vite) y soporte backend. Orientado a conversión, integraciones de APIs y manejo de datos.",
        precio: 800.00,
        id_imagen: null
      },
      {
        id_servicio: 3,
        nombre: "Liderazgo Técnico (Tech Lead)",
        descripcion: "Liderazgo de equipos, revisión de código, aseguramiento de calidad y coordinación ágil entre stakeholders.",
        precio: 1000.00,
        id_imagen: null
      },
      {
        id_servicio: 4,
        nombre: "Automatización de Procesos",
        descripcion: "Creación de automatizaciones con Google Apps Script y otras herramientas para tareas operativas repetitivas.",
        precio: 400.00,
        id_imagen: null
      }
    ], { updateOnDuplicate: ["nombre", "descripcion", "precio", "id_imagen"] });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("servicio", null, {});
  }
};
