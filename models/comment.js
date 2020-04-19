'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequlize;

const Commnet = loader.database.define('comments',{
  commentId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  band_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  passtime: {
    type: Sequelize.DATE,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: false
});

module.exports = Commnet;