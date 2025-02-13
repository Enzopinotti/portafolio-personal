"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up (queryInterface, Sequelize) {
    // Hashear contraseñas de ejemplo
    const passwordAdmin = bcrypt.hashSync("Admin123!", 10);
    const passwordUser = bcrypt.hashSync("User123!", 10);

    return queryInterface.bulkInsert("usuario", [
      {
        id_usuario: 1,
        nombre: "Enzo",
        apellido: "Pinotti",
        email: "enzopinottii@gmail.com",
        password: passwordAdmin,
        id_rol: 1, 
        fecha_registro: new Date()
      },
      {
        id_usuario: 2,
        nombre: "John",
        apellido: "User",
        email: "user@gmail.com",
        password: passwordUser,
        id_rol: 2,             
        fecha_registro: new Date()
      }
      // Podrías insertar más si lo deseas
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete("usuario", null, {});
  }
};
