"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("servicio", [
      {
        id_servicio: 1,
        nombre: "Desarrollo Web",
        descripcion: "Servicio de creación de sitios y aplicaciones web",
        precio: 500.00,
        id_imagen: null
      },
      {
        id_servicio: 2,
        nombre: "Consultoría",
        descripcion: "Te ayudo a planificar y mejorar tus proyectos de software",
        precio: 300.00,
        id_imagen: null
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("servicio", null, {});
  }
};
