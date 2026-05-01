"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "servicio",
      [
        {
          id_servicio: 1,
          nombre: "services.items.digitalManagement.name",
          descripcion: "services.items.digitalManagement.description",
          precio: null,
          id_imagen: null,
          icono: "layers",
        },
        {
          id_servicio: 2,
          nombre: "services.items.saasProducts.name",
          descripcion: "services.items.saasProducts.description",
          precio: null,
          id_imagen: null,
          icono: "cubes",
        },
        {
          id_servicio: 3,
          nombre: "services.items.apps.name",
          descripcion: "services.items.apps.description",
          precio: null,
          id_imagen: null,
          icono: "mobile",
        },
        {
          id_servicio: 4,
          nombre: "services.items.aiBots.name",
          descripcion: "services.items.aiBots.description",
          precio: null,
          id_imagen: null,
          icono: "robot",
        },
        {
          id_servicio: 5,
          nombre: "services.items.biData.name",
          descripcion: "services.items.biData.description",
          precio: null,
          id_imagen: null,
          icono: "chart",
        },
        {
          id_servicio: 6,
          nombre: "services.items.automation.name",
          descripcion: "services.items.automation.description",
          precio: null,
          id_imagen: null,
          icono: "bolt",
        },
      ],
      { updateOnDuplicate: ["nombre", "descripcion", "precio", "id_imagen", "icono"] }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("servicio", null, {});
  },
};
