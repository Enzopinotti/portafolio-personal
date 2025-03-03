// migrations/20230713120000-add-avatarPublicId-to-usuario.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuario', 'avatar_public_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuario', 'avatar_public_id');
  },
};
