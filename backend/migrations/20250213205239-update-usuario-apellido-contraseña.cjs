"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregamos la columna fecha_registro con valor por defecto NOW
    await queryInterface.addColumn("usuario", "fecha_registro", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn("NOW")
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminamos la columna si hacemos 'db:migrate:undo'
    await queryInterface.removeColumn("usuario", "fecha_registro");
  }
};
