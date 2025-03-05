// migrations/20250304190000-create-skill-categoria.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skill_categoria', {
      id_skill: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      id_categoria_skill: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('skill_categoria');
  }
};
