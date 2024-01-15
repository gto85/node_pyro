const { DataTypes } = require("sequelize");
const db = require("../connections/db.connection");

const CheckPayment = db.define("CheckPayment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'OrderPayment',
      key: 'id',
    },
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Дополнительные поля для отслеживания подтверждения платежа
  // ...
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = CheckPayment;