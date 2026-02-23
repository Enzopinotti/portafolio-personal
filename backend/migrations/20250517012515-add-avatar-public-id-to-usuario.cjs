'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('usuario', 'avatar_public_id', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    } catch (e) { console.log(e.message) }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'avatar_public_id');
  }
};
