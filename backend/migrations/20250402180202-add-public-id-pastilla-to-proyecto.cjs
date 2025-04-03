'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proyecto', 'public_id_pastilla', {
      type: Sequelize.STRING(255),
      allowNull: true, // puede ser true si no siempre hay una portada
      field: 'public_id_pastilla',
      defaultValue: null, // si quieres un valor por defecto
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyecto', 'public_id_pastilla');
  },
};
