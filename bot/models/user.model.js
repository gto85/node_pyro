const db  = require("../connections/db.connection");
const { DataTypes} = require("sequelize");

module.exports = db.define(
  "user",
  {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          unique: true,
          allowNull: false,
      },
      login: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      username: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      privileged: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
      },
      age: {
          type: DataTypes.INTEGER,
          allowNull: true,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      address: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      who_invite: {
          type: DataTypes.UUID,
          allowNull: true,
      },
      referral_code: {
          type: DataTypes.STRING,
          allowNull: true,
      },
  },
  {
      timestamps: true,
      updateAt: false,
  }
);