"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertamos los roles básicos
    return queryInterface.bulkInsert("rol", [
      { id_rol: 1, nombre: "admin" },
      { id_rol: 2, nombre: "usuario" }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Borramos todo de la tabla rol
    return queryInterface.bulkDelete("rol", null, {});
  }
};
