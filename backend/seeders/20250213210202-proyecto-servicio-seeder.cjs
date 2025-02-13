"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    // Vinculamos el proyecto #1 con el servicio #1, y el proyecto #2 con el servicio #2
    return queryInterface.bulkInsert("proyecto_servicio", [
      {
        id_proyecto: 1,
        id_servicio: 1
      },
      {
        id_proyecto: 2,
        id_servicio: 2
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("proyecto_servicio", null, {});
  }
};
