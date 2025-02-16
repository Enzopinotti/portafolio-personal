'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario', {
      id_usuario: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      id_rol: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('visitante', 'usuario', 'admin'),
        allowNull: false,
        defaultValue: 'visitante'
      },
      fecha_registro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuario');
  }
};