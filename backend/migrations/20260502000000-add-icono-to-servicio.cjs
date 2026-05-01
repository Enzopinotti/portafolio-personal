'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('servicio', 'icono', {
      type: Sequelize.STRING(64),
      allowNull: true,
      defaultValue: null,
      after: 'id_imagen',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('servicio', 'icono');
  },
};
