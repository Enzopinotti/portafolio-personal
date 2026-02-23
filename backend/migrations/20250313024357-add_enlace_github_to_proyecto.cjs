'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('proyecto', 'enlace_github', {
        type: Sequelize.STRING(255),
        allowNull: true,
        after: 'enlace',
      });
    } catch (e) { console.log(e.message) }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyecto', 'enlace_github');
  }
};
