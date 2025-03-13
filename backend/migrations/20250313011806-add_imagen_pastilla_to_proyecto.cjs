'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proyecto', 'imagen_pastilla', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'max_imagenes' // posición lógica después del campo especificado
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyecto', 'imagen_pastilla');
  }
};
