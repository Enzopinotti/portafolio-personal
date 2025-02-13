"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("proyecto", [
      {
        id_proyecto: 1,
        titulo: "Portfolio Personal",
        descripcion: "Proyecto para mostrar mis trabajos",
        fecha_inicio: new Date("2022-01-01"),
        fecha_fin: new Date("2022-03-01"),
        enlace: "https://github.com/mi-portfolio",
        max_imagenes: 5
      },
      {
        id_proyecto: 2,
        titulo: "E-Commerce Demo",
        descripcion: "Tienda en línea de prueba",
        fecha_inicio: new Date("2022-02-15"),
        fecha_fin: null,
        enlace: "https://github.com/e-commerce-demo",
        max_imagenes: 5
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("proyecto", null, {});
  }
};
