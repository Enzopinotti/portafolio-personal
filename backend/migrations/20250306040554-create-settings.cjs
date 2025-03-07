'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('settings', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      siteTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'My Site'
      },
      siteDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'Welcome to my website.'
      },
      supportEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'support@example.com'
      },
      facebookUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitterUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instagramUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedinUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primaryColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#3344DC'
      },
      secondaryColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#960C28'
      },
      backgroundColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#ffffff'
      },
      textColor: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#333333'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('settings');
  }
};
