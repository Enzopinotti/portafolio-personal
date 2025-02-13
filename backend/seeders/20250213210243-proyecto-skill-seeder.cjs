"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    // Proyecto #1 usa Skill #1 (JavaScript) y Skill #2 (Node.js)
    return queryInterface.bulkInsert("proyecto_skill", [
      {
        id_proyecto: 1,
        id_skill: 1
      },
      {
        id_proyecto: 1,
        id_skill: 2
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("proyecto_skill", null, {});
  }
};
