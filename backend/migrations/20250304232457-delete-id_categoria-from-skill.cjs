'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('skill', 'id_categoria_skill');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('skill', 'id_categoria_skill', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  }
};
