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
    field: 'siteTitle'
  },
  siteDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: 'Welcome to my website.',
    field: 'siteDescription'
  },
  supportEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'support@example.com',
    field: 'supportEmail'
  },
  // Redes sociales
  facebookUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'facebookUrl'
  },
  twitterUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'twitterUrl'
  },
  instagramUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'instagramUrl'
  },
  linkedinUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'linkedinUrl'
  },
  // Colores (utilizaremos dos principales, más background y text)
  primaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#3344DC',
    field: 'primaryColor'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#960C28',
    field: 'secondaryColor'
  },
  backgroundColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#ffffff',
    field: 'backgroundColor'
  },
  textColor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#333333',
    field: 'textColor'
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
