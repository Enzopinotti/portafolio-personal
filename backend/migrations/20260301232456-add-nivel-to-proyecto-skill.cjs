"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("proyecto_skill", "nivel", {
            type: Sequelize.TINYINT.UNSIGNED,
            allowNull: true,
            defaultValue: null,
            after: "id_skill",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("proyecto_skill", "nivel");
    },
};
