'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('settings', 'typewriter_words_e_s', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: 'Ingeniero industrial, Desarrollador Fullstack, Analista de Sistemas, Diseñador UX/UI'
        });
        await queryInterface.addColumn('settings', 'typewriter_words_e_n', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: 'Industrial Engineer, Fullstack Developer, Systems Analyst, UX/UI Designer'
        });
        await queryInterface.addColumn('settings', 'typewriter_words_p_t', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: 'Engenheiro Industrial, Desarrollador Fullstack, Analista de Sistemas, Designer UX/UI'
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('settings', 'typewriter_words_e_s');
        await queryInterface.removeColumn('settings', 'typewriter_words_e_n');
        await queryInterface.removeColumn('settings', 'typewriter_words_p_t');
    }
};
