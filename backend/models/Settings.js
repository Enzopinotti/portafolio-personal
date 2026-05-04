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
    defaultValue: 'My Site',
    field: 'site_title'
  },
  siteDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Welcome to my website.',
    field: 'site_description'
  },
  supportEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'support@example.com',
    field: 'support_email'
  },
  // Redes sociales
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'facebook_url'
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'twitter_url'
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'instagram_url'
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'linkedin_url'
  },
  // Colores (utilizaremos dos principales, más background y text)
  primaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#3344DC',
    field: 'primary_color'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#960C28',
    field: 'secondary_color'
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#ffffff',
    field: 'background_color'
  },
  textColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#333333',
    field: 'text_color'
  },
  typewriterWordsES: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Ingeniero industrial, Desarrollador Fullstack, Analista de Sistemas, Diseñador UX/UI',
    field: 'typewriter_words_e_s'
  },
  typewriterWordsEN: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Industrial Engineer, Fullstack Developer, Systems Analyst, UX/UI Designer',
    field: 'typewriter_words_e_n'
  },
  typewriterWordsPT: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Engenheiro Industrial, Desarrollador Fullstack, Analista de Sistemas, Designer UX/UI',
    field: 'typewriter_words_p_t'
  }
}, {
  tableName: 'settings',
  timestamps: false,
});

export default Settings;
