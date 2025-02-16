'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuario', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('usuario', 'resetTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'resetToken');
    await queryInterface.removeColumn('usuario', 'resetTokenExpires');
  }
};
