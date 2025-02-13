'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {


    // Agregar columna "fecha_registro"
    await queryInterface.addColumn("usuario", "refresh_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });

  },

};
