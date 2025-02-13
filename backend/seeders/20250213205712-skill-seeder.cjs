"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    // Insertamos 2 skills. id_categoria_skill=1 => Frontend, id_categoria_skill=2 => Backend
    return queryInterface.bulkInsert("skill", [
      {
        id_skill: 1,
        nombre: "JavaScript",
        nivel: 80,  
        id_categoria_skill: 1, 
        id_imagen: null
      },
      {
        id_skill: 2,
        nombre: "Node.js",
        nivel: 75,
        id_categoria_skill: 2,
        id_imagen: null
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("skill", null, {});
  }
};
