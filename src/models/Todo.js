const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Todo = sequelize.define(
  'Todo',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'todos',
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Todo;