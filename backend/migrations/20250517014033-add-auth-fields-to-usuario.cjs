'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('usuario', 'refresh_token', {
        type: Sequelize.STRING(512),
        allowNull: true,
      });
    } catch (e) { console.log('refresh_token já existe') }

    try {
      await queryInterface.addColumn('usuario', 'emailToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (e) { console.log('emailToken já existe') }

    try {
      await queryInterface.addColumn('usuario', 'emailTokenExpires', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    } catch (e) { console.log('emailTokenExpires já existe') }

    try {
      await queryInterface.addColumn('usuario', 'emailConfirmed', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    } catch (e) { console.log('emailConfirmed já existe') }

    try {
      await queryInterface.addColumn('usuario', 'resetToken', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (e) { console.log('resetToken já existe') }

    try {
      await queryInterface.addColumn('usuario', 'resetTokenExpires', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    } catch (e) { console.log('resetTokenExpires já existe') }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuario', 'refresh_token');
    await queryInterface.removeColumn('usuario', 'emailToken');
    await queryInterface.removeColumn('usuario', 'emailTokenExpires');
    await queryInterface.removeColumn('usuario', 'emailConfirmed');
    await queryInterface.removeColumn('usuario', 'resetToken');
    await queryInterface.removeColumn('usuario', 'resetTokenExpires');
  }
};
