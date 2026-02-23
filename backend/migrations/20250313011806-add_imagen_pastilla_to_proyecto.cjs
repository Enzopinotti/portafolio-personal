'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('proyecto', 'imagen_pastilla', {
        type: Sequelize.STRING(255),
        allowNull: true,
        after: 'max_imagenes' 
      });
    } catch (e) { console.log(e.message) }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyecto', 'imagen_pastilla');
  }
};
