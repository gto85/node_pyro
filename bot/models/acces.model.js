const { DataTypes } = require("sequelize");
const db = require("../connections/db.connection");

const Access = db.define("Access", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  userListId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'UserList',
      key: 'id',
    },
  },
  // Дополнительные поля для управления доступом
  // ...
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = Access;