"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertamos 2 categorías de ejemplo
    return queryInterface.bulkInsert("categoria_skill", [
      {
        id_categoria_skill: 1,
        nombre: "Frontend"
      },
      {
        id_categoria_skill: 2,
        nombre: "Backend"
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    // Borramos todo de la tabla o solo estos IDs
    return queryInterface.bulkDelete("categoria_skill", null, {});
  }
};
