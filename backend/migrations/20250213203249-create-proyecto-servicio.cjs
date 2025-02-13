'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proyecto_servicio', {
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
      id_servicio: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'servicio',
          key: 'id_servicio'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('proyecto_servicio');
  }
};
