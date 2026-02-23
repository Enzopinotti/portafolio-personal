"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("articulo", [
      {
        id_articulo: 1,
        titulo: "Mi primer post",
        contenido: "Contenido de ejemplo para mi primer artículo",
        fecha_publicacion: new Date("2023-01-01"),
        autor: "Admin",
        categoria: "Tutorial",
        id_usuario: 1 // Relacionado al usuario con id 1 (admin)
      },
      {
        id_articulo: 2,
        titulo: "Tips para frontend",
        contenido: "Algunos tips y buenas prácticas para el desarrollo frontend",
        fecha_publicacion: new Date("2023-02-10"),
        autor: "JohnUser",
        categoria: "Frontend",
        id_usuario: 2 // Relacionado al usuario con id 2 (usuario normal)
      }
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("articulo", null, {});
  }
};
