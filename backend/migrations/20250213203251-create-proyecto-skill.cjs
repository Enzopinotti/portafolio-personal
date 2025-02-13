'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proyecto_skill', {
      id_proyecto: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'proyecto',
          key: 'id_proyecto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_skill: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'skill',
          key: 'id_skill'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('proyecto_skill');
  }
};
