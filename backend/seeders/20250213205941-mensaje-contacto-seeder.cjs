"use strict";

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert("testimonio", [
      {
        id_testimonio: 1,
        nombre: "Jane the Visitor",
        mensaje: "Excelente servicio, quedé muy satisfecho con el resultado.",
        fecha: new Date(),
        id_usuario: null // Testimonio anónimo (visitante)
      },
      {
        id_testimonio: 2,
        nombre: "JohnUser",
        mensaje: "Gran profesional, me ayudó mucho en mi proyecto.",
        fecha: new Date(),
        id_usuario: 2 // Asocia al usuario con id_usuario=2 (JohnUser)
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("testimonio", null, {});
  }
};
