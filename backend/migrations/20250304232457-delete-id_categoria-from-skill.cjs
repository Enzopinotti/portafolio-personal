'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // First, get the foreign key constraint name
      const [results] = await queryInterface.sequelize.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'skill' 
        AND COLUMN_NAME = 'id_categoria_skill' 
        AND REFERENCED_TABLE_NAME IS NOT NULL;
      `);

      if (results && results.length > 0) {
        // Drop the foreign key constraint first
        const constraintName = results[0].CONSTRAINT_NAME;
        await queryInterface.removeConstraint('skill', constraintName);
      }

      // Then drop the column
      await queryInterface.removeColumn('skill', 'id_categoria_skill');
    } catch (error) {
      console.log('Column might not exist or already dropped: ', error.message);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn('skill', 'id_categoria_skill', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      });
      console.log('Please recreate the foreign key manually if needed in down migration');
    } catch (error) {
      console.log('Error adding column back: ', error.message);
    }
  }
};
