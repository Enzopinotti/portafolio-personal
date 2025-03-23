'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Renombrar la columna "nombre" a "nombre_completo"
    await queryInterface.renameColumn('mensaje_contacto', 'nombre', 'nombre_completo');

    // 2) Eliminar la columna "asunto"
    await queryInterface.removeColumn('mensaje_contacto', 'asunto');

    // 3) Agregar la columna "servicio_interes"
    await queryInterface.addColumn('mensaje_contacto', 'servicio_interes', {
      type: Sequelize.STRING(255),
      allowNull: false, // Ajusta a false o true según lo que necesites
      after: 'email',   // Opcional: para ubicarla después de la columna "email"
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios:

    // 1) Renombrar "nombre_completo" a "nombre"
    await queryInterface.renameColumn('mensaje_contacto', 'nombre_completo', 'nombre');

    // 2) Recrear la columna "asunto"
    await queryInterface.addColumn('mensaje_contacto', 'asunto', {
      type: Sequelize.STRING(255),
      allowNull: false, // Ajusta según la configuración original
      after: 'email',   // Opcional, para mantener la posición
    });

    // 3) Eliminar la columna "servicio_interes"
    await queryInterface.removeColumn('mensaje_contacto', 'servicio_interes');
  }
};
