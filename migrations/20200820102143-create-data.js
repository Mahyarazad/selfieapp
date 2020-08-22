'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mod: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.FLOAT
      },
      lon: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'createdat'
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'updatedat'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data');
  }
};
