"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Asignamos el usuario #1 (admin) a proyecto #1 y #2
    // Y el usuario #2 a proyecto #2
    return queryInterface.bulkInsert("usuario_proyecto", [
      {
        id_usuario: 1,
        id_proyecto: 1
      },
      {
        id_usuario: 1,
        id_proyecto: 2
      },
      {
        id_usuario: 2,
        id_proyecto: 2
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("usuario_proyecto", null, {});
  }
};
