'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Renombrar la columna "nombre" a "nombre_completo"
    try {
      await queryInterface.renameColumn('mensaje_contacto', 'nombre', 'nombre_completo');
    } catch (e) {
      console.warn('No se pudo renombrar "nombre" a "nombre_completo". Quizás ya se hizo.');
    }

    // 2) Eliminar la columna "asunto"
    try {
      await queryInterface.removeColumn('mensaje_contacto', 'asunto');
    } catch (e) {
      console.warn('No se pudo eliminar la columna "asunto". Quizás ya no existe.');
    }

    // 3) Agregar la columna "servicio_interes"
    try {
      await queryInterface.addColumn('mensaje_contacto', 'servicio_interes', {
        type: Sequelize.STRING(255),
        allowNull: false,
        after: 'email',
      });
    } catch (e) {
      console.warn('No se pudo añadir la columna "servicio_interes". Quizás ya existe.');
    }
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
