'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequlize;

const User = loader.database.define('users',{
  userId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: false
});

module.exports = User;