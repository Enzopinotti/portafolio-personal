"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {


    // Agregar columna "fecha_registro"
    await queryInterface.addColumn("usuario", "fecha_registro", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    });

  },

  async down(queryInterface, Sequelize) {
    
  }
};
