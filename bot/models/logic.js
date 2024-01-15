const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../connections/db.connection');
const text = require('../inf/text');
const menu = require('../middleware/command/menu');
const date = require('date-and-time');

class User extends Model {}
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    access: DataTypes.STRING
  },
  {
    sequelize,
    tableName: 'access',
    timestamps: false
  }
);

class CheckPayment extends Model {}
CheckPayment.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'check_payment',
    timestamps: false
  }
);

class OrderPayment extends Model {}
OrderPayment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    qiwi: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'order_payment',
    timestamps: false
  }
);

async function getProfile(userId, name) {
  const user = await User.findOne({
    where: { user_id: userId }
  });

  if (!user) {
    return [text.profile({ id: userId, name, access: '❌' }), menu.noAccess];
  }

  return [text.profile({ id: userId, name, access: '✅' }), menu.noAccess];
}

async function createBuyAccess(userId) {
  const code = ( 9999999999);

  await CheckPayment.create({
    user_id: userId,
    amount: process.env.ACCESS_COST,
    code: code
  });

  return text.buy_access;
}

async function cancelBuyAccess(userId) {
  await CheckPayment.destroy({
    where: { user_id: userId }
  });

  return 'Purchase cancelled';
}

async function getAdminProfit() {
  const result = await sequelize.query('SELECT SUM(amount) AS profit FROM admin_balance', {
    type: sequelize.QueryTypes.SELECT
  });

  const profit = parseFloat(result[0]?.profit || 0);

  return text.adminProfit({ profit });
}

async function getAdminInfo() {
  const [userRes, depositRes] = await Promise.all([
    User.count(),
    CheckPayment.count()
  ]);

  return text.adminInfo({
    users: userRes,
    deposits: depositRes
  });
}

async function listPayments() {
  const payments = await OrderPayment.findAll();

  let text = '';
  payments.forEach((payment, i) => {
    text += `🔥 ${i} | USER ID ${payment.user_id} | Сумма ${payment.amount}\n`;
  });

  return text;
}

async function getPaymentInfo(paymentId) {
  const payment = await OrderPayment.findByPk(paymentId);

  if (!payment) {
    return 'Payment not found';
  }

  return text.paymentInfo({
    id: payment.id,
    user_id: payment.user_id,
    amount: payment.amount,
    date: payment.date,
    qiwi: payment.qiwi
  });
}

async function deletePayment(paymentId) {
  await OrderPayment.destroy({
    where: { id: paymentId }
  });

  return 'Payment deleted';
}

async function getUserAccessInfo(userId) {
  const user = await User.findOne({
    where: { user_id: userId }
  });

  if (!user) {
    return 'User not found';
  }

  return text.accessInfo({
    refCode: user.ref_code,

    refUrl: `https://tele.gg/${process.env.BOT_LOGIN}?start=${user.ref_code}`,
    profit: user.profit,
    invitedCount: user.invited_count
  });
}

async function createPayoutOrder(userId, amount, name, qiwi) {
  const orderId = generateRandomId();
  const date = formatDate(new Date());

  await OrderPayment.create({
    id: orderId,
    user_id: userId,
    name: name,
    amount: amount,
    date: date,
    qiwi: qiwi
  });

  await User.update(
    { balance: sequelize.literal(`balance - ${amount}`) },
    { where: { user_id: userId } }
  );

  return 'Payout order created successfully!';
}

async function handleRefCode(userId, refCode) {
  const referrer = await User.findOne({
    where: { ref_code: refCode }
  });

  if (!referrer) {
    return 'Invalid referral code';
  }

  await User.update(
    { referrer_id: referrer.user_id },
    { where: { user_id: userId } }
  );

  return 'Referral applied!';
}

module.exports = {
  getProfile,
  createBuyAccess,
  cancelBuyAccess,
  getAdminProfit,
  getAdminInfo,
  listPayments,
  getPaymentInfo,
  deletePayment,
  getUserAccessInfo,
  createPayoutOrder,
  handleRefCode
};
