'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('testimonio', 'publicado', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    } catch (error) {
      console.warn('La columna "publicado" ya existe en "testimonio". Omitiendo...');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('testimonio', 'publicado');
  },
};
