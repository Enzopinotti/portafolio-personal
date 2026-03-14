// src/models/Settings.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  siteTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'My Site'
  },
  siteDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Welcome to my website.'
  },
  supportEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'support@example.com'
  },
  // Redes sociales
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Colores (utilizaremos dos principales, más background y text)
  primaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#3344DC'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#960C28'
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#ffffff'
  },
  textColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#333333'
  },
  typewriterWordsES: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Ingeniero industrial, Desarrollador Fullstack, Analista de Sistemas, Diseñador UX/UI'
  },
  typewriterWordsEN: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Industrial Engineer, Fullstack Developer, Systems Analyst, UX/UI Designer'
  },
  typewriterWordsPT: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Engenheiro Industrial, Desarrollador Fullstack, Analista de Sistemas, Designer UX/UI'
  }
}, {
  tableName: 'settings',
  timestamps: false,
});

export default Settings;
