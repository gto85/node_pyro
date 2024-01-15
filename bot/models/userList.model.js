const { DataTypes } = require("sequelize");
const db = require("../connections/db.connection");

const UserList = db.define("UserList", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  // Дополнительные поля списка пользователей
  // ...
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = UserList;