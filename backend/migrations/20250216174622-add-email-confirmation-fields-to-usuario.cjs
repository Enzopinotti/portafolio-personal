'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuario', 'emailToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('usuario', 'emailTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('usuario', 'emailConfirmed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'emailToken');
    await queryInterface.removeColumn('usuario', 'emailTokenExpires');
    await queryInterface.removeColumn('usuario', 'emailConfirmed');
  }
};
