'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequlize;

const Timetable = loader.database.define('timetables',{

  band_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  responsible_person: {
    type: Sequelize.STRING,
    allowNull: false
  },
  timetable_info_weekday: {
    type :Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  timetable_info_period: {
    type :Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  createdBy: {
    type :Sequelize.INTEGER,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: false,
});

module.exports = Timetable;
