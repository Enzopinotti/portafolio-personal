'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('imagen', 'public_id', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '', // Si ya tenés imágenes previas, evitás que falle al no tener null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('imagen', 'public_id');
  }
};
