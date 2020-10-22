'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  data.init({
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true },

    mod: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lon: DataTypes.FLOAT,
    user_id: {
          type: DataTypes.INTEGER,
          references: 'users', // <<< Note, its table's name, not object name
          referencesKey: 'id' // <<< Note, its a column name
    },
    uname: {
          type: DataTypes.STRING,
          references: 'users', // <<< Note, its table's name, not object name
          referencesKey: 'username' // <<< Note, its a column name
    }

  }, {
    sequelize,
    modelName: 'data',
  });

  return data;
};
