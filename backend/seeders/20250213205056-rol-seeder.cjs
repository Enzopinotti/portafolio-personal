"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertamos los roles básicos
    return queryInterface.bulkInsert("rol", [
      { id_rol: 1, nombre: "admin" },
      { id_rol: 2, nombre: "usuario" },
      { id_rol: 3, nombre: "visitante" }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Borramos todo de la tabla rol
    return queryInterface.bulkDelete("rol", null, {});
  }
};
