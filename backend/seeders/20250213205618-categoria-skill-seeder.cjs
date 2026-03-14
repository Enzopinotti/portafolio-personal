"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertamos 2 categorías de ejemplo
    return queryInterface.bulkInsert("categoria_skill", [
      { id_categoria_skill: 1, nombre: "categories.frontend" },
      { id_categoria_skill: 2, nombre: "categories.backend" },
      { id_categoria_skill: 3, nombre: "categories.automation" },
      { id_categoria_skill: 4, nombre: "categories.data" },
      { id_categoria_skill: 5, nombre: "categories.marketing" },
      { id_categoria_skill: 6, nombre: "categories.management" }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    // Borramos todo de la tabla o solo estos IDs
    return queryInterface.bulkDelete("categoria_skill", null, {});
  }
};
