"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("servicio", [
      {
        id_servicio: 1,
        nombre: "services.items.data.name",
        descripcion: "services.items.data.description",
        precio: 600.00,
        id_imagen: null
      },
      {
        id_servicio: 2,
        nombre: "services.items.fullstack.name",
        descripcion: "services.items.fullstack.description",
        precio: 800.00,
        id_imagen: null
      },
      {
        id_servicio: 3,
        nombre: "services.items.techlead.name",
        descripcion: "services.items.techlead.description",
        precio: 1000.00,
        id_imagen: null
      },
      {
        id_servicio: 4,
        nombre: "services.items.automation.name",
        descripcion: "services.items.automation.description",
        precio: 400.00,
        id_imagen: null
      }
    ], { updateOnDuplicate: ["nombre", "descripcion", "precio", "id_imagen"] });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("servicio", null, {});
  }
};
