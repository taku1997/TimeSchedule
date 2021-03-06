'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/timetable',
  {
    operatorsAliases: false,
    dialectOptions: {
      ssl: true
    }
  }
);

module.exports = {
  database: sequelize,
  Sequlize: Sequelize
};

