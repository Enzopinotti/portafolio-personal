'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('imagen', 'public_id', {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: '', // Si ya tenés imágenes previas, evitás que falle al no tener null
      });
    } catch (e) { console.log(e.message) }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('imagen', 'public_id');
  }
};
