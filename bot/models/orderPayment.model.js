const { DataTypes } = require("sequelize");
const db = require("../connections/db.connection");

const OrderPayment = db.define("OrderPayment", {
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
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // Дополнительные поля заказа и платежа
  // ...
}, {
  timestamps: true,
  updatedAt: false,
});

module.exports = OrderPayment;