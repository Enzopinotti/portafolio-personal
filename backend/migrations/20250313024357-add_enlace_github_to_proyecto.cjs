'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proyecto', 'enlace_github', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'enlace', // Opcional: indica que la nueva columna aparecerá después de la columna 'enlace'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyecto', 'enlace_github');
  }
};
