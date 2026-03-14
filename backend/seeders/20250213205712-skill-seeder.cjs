"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insertamos 2 skills. id_categoria_skill=1 => Frontend, id_categoria_skill=2 => Backend
    const skills = [
      // Frontend (Cat 1)
      { id_skill: 1, nombre: "skills.react", nivel: 95, id_imagen: null, catId: 1 },
      { id_skill: 2, nombre: "skills.vite", nivel: 90, id_imagen: null, catId: 1 },
      { id_skill: 3, nombre: "skills.javascript", nivel: 96, id_imagen: null, catId: 1 },
      { id_skill: 4, nombre: "skills.html_css", nivel: 98, id_imagen: null, catId: 1 },
      { id_skill: 5, nombre: "skills.sass", nivel: 90, id_imagen: null, catId: 1 },
      { id_skill: 6, nombre: "skills.vue", nivel: 85, id_imagen: null, catId: 1 },
      { id_skill: 7, nombre: "skills.mjml", nivel: 95, id_imagen: null, catId: 1 },
      // Backend & Cloud (Cat 2)
      { id_skill: 8, nombre: "skills.nodejs", nivel: 90, id_imagen: null, catId: 2 },
      { id_skill: 9, nombre: "skills.express", nivel: 88, id_imagen: null, catId: 2 },
      { id_skill: 10, nombre: "skills.mongodb", nivel: 85, id_imagen: null, catId: 2 },
      { id_skill: 11, nombre: "skills.sql", nivel: 88, id_imagen: null, catId: 2 },
      { id_skill: 12, nombre: "skills.websockets", nivel: 82, id_imagen: null, catId: 2 },
      // Automation (Cat 3)
      { id_skill: 13, nombre: "skills.gas", nivel: 95, id_imagen: null, catId: 3 },
      { id_skill: 14, nombre: "skills.zapier_make", nivel: 92, id_imagen: null, catId: 3 },
      { id_skill: 15, nombre: "skills.process_automation", nivel: 94, id_imagen: null, catId: 3 },
      // Data & BI (Cat 4)
      { id_skill: 16, nombre: "skills.powerbi", nivel: 92, id_imagen: null, catId: 4 },
      { id_skill: 17, nombre: "skills.looker", nivel: 88, id_imagen: null, catId: 4 },
      { id_skill: 18, nombre: "skills.excel_dashboards", nivel: 95, id_imagen: null, catId: 4 },
      { id_skill: 19, nombre: "skills.kpis", nivel: 90, id_imagen: null, catId: 4 },
      // Marketing (Cat 5)
      { id_skill: 20, nombre: "skills.digital_mkt", nivel: 90, id_imagen: null, catId: 5 },
      { id_skill: 21, nombre: "skills.google_meta_ads", nivel: 88, id_imagen: null, catId: 5 },
      { id_skill: 22, nombre: "skills.growth_hacking", nivel: 85, id_imagen: null, catId: 5 },
      { id_skill: 23, nombre: "skills.email_mkt_crm", nivel: 92, id_imagen: null, catId: 5 },
      // Management (Cat 6)
      { id_skill: 24, nombre: "skills.tech_lead", nivel: 90, id_imagen: null, catId: 6 },
      { id_skill: 25, nombre: "skills.agile", nivel: 92, id_imagen: null, catId: 6 },
      { id_skill: 26, nombre: "skills.requirements", nivel: 95, id_imagen: null, catId: 6 },
      { id_skill: 27, nombre: "skills.documentation", nivel: 93, id_imagen: null, catId: 6 }
    ];

    await queryInterface.bulkInsert("skill", skills.map(({ catId, ...rest }) => rest), { ignoreDuplicates: true });

    const skillCategorias = skills.map(s => ({
      id_skill: s.id_skill,
      id_categoria_skill: s.catId
    }));

    return queryInterface.bulkInsert("skill_categoria", skillCategorias, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skill_categoria", null, {});
    return queryInterface.bulkDelete("skill", null, {});
  }
};
