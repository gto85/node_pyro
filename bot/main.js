require("dotenv").config();

const { Telegraf, session, Markup} = require('telegraf');
const { Sequelize, DataTypes } = require('sequelize');
const menu = require('./middleware/command/menu');
const text = require('./inf/text');
const logic = require('./models/logic');
const { v4: uuidv4 } = require('uuid');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  username: DataTypes.STRING,
  created_at: DataTypes.DATE,
  who_invite: DataTypes.INTEGER,
  referral_code: DataTypes.STRING,
  access: DataTypes.STRING
});

User.sync();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
  const row = await User.findAll({ where: { user_id: ctx.chat.id } });

  if (row.length === 0) {
    const who_invite = ctx.message.text.slice(7) === '' ? 0 : ctx.message.text.slice(7);
    const referral_code = uuidv4().toUpperCase();
    await User.create({
      user_id: ctx.chat.id,
      username: ctx.from.username,
      created_at: new Date(),
      who_invite: who_invite,
      referral_code: referral_code,
      access: "no"
    });

    ctx.reply(text.start_menu.replace('{name}', ctx.from.first_name).replace('{id}', ctx.chat.id), menu.menu_access_no);
  } else {
    ctx.reply(text.start_menu.replace('{name}', ctx.from.first_name).replace('{id}', ctx.chat.id), menu.menu_access_no);
  }
});

bot.command('admin', (ctx) => {
  if (ctx.chat.id === process.env.ADMIN_ID) {
    ctx.reply(text.admin_menu.replace('{name}', ctx.from.first_name), menu.menuAdmin);
  }
});

bot.on('text', async (ctx) => {
  const lzt = `${process.env.CODE_ACCESS}${new Date().toISOString().slice(0, 10)}`;

  if (ctx.message.text === lzt) {
    const row = await User.findAll({ where: { user_id: ctx.chat.id } });

    if (row.length === 0) {
      await logic.free(ctx.chat.id, lzt);
      ctx.reply(`Доступ успешно получен по коду - ${lzt}`, menu.menuAccessYes);
    }
  }
});
bot.action('admin_list_order_payment', async (ctx) => {
  ctx.session.currentMessage = await ctx.editMessageText(
    `❗️ Список запросов на вывод\n\n${logic.admin_list_order_payment()}\n❗️ Введите номер запроса для получения подробной информации`,
    menu.btn_back_to_admin_menu
  );

  await ctx.scene.enter('info_order_payment');
});

bot.action('back_to_admin_menu', async (ctx) => {
  await ctx.editMessageText('Админ меню', menu.menuAdmin);
});

bot.action('del_order', async (ctx) => {
  const message = await ctx.editMessageText(logic.order(logic.num_order), menu.btn_back_to_admin_menu);
});

bot.action('go_main_menu', async (ctx) => {
  const markup = Markup.keyboard([Markup.button('Yes')])
    .resize()
    .oneTime();

  const message = await ctx.reply('❗️ Вы хотите выйти из меню админа?', markup);
  await ctx.scene.enter('start');
});

bot.action('order_payout', async (ctx) => {
  const info = logic.order_payout(ctx.chat.id);
  const message = await ctx.reply(info[0]);

  const balance = logic.Balance(ctx.chat.id);
  logic.balance_dict[ctx.chat.id] = balance;
  balance.balance = info[1];

  ctx.session.currentMessage = message;
  ctx.scene.enter('order_payout_2');
});
const infoOrderPayment = async (ctx) => {
  try {
    const info = logic.admin_info_order_payment(ctx.message.text);

    const message = await ctx.reply(info[0], menu.admin_order_info);
    ctx.session.currentMessage = message;
    logic.num_order = info[1];
  } catch (e) {
    await ctx.reply('Упсс, что-то пошло не по плану', menu.btnBackToAdminMenu);
  }
};

const orderPayout2 = async (ctx) => {
  try {
    const balance = logic.balance_dict[ctx.chat.id];
    balance.sum = parseFloat(ctx.message.text);

    if (parseFloat(ctx.message.text) < process.env.MIN_PAYOUT) {
      await ctx.reply('❌ Введенная сумма меньше минимальной', menu.menuAccessYes);
    } else if (parseFloat(ctx.message.text) > balance.balance) {
      await ctx.reply('❌ На балансе недостаточно средств', menu.menuAccessYes);
    } else {
      const message = await ctx.reply(`❗️ Сумма - ${balance.sum}\n❗️ Введите свой номер qiwi, на него будет произведена выплата!`);
      ctx.session.currentMessage = message;
      ctx.scene.enter('order_payout_3');
    }
  } catch (e) {
    await ctx.reply('Упсс, что-то пошло не по плану', menu.menuAccessYes);
  }
};

const orderPayout3 = async (ctx) => {
  try {
    const balance = logic.balance_dict[ctx.chat.id];
    balance.number = ctx.message.text;

    const markup = Markup.keyboard(['Yes', 'No']).resize().oneTime();
    ctx.session.currentMessage = await ctx.reply(`❗️ Проверьте данные и подтвердите запрос\n\n` +
      `❕ Сумма - ${balance.sum}\n` +
      `❕ Номер - ${balance.number}\n\n` +
      `❗️ Запросить вывод?`, markup);
    await ctx.scene.enter('order_payout_4');
  } catch (e) {
    await ctx.reply('Упсс, что-то пошло не по плану', menu.menuAccessYes);
  }
};

const orderPayout4 = async (ctx) => {
  const balance = logic.balance_dict[ctx.chat.id];
  if (ctx.message.text === 'Yes') {
    logic.order_payout_2(ctx.chat.id, balance.sum, ctx.from.username, balance.number);
    await ctx.reply('✅ Запрос на вывод успешно создан', menu.menuAccessYes);
  } else if (ctx.message.text === 'No') {
    await ctx.reply('❌ Вы отменили создание запроса на вывод средств', menu.menuAccessYes);
  }
};

bot.action('info_order_payment', infoOrderPayment);
bot.hears('back_to_admin_menu', (ctx) => ctx.scene.enter('start'));
bot.action('del_order', (ctx) => ctx.scene.enter('start'));
bot.action('order_payout', (ctx) => ctx.scene.enter('order_payout_2'));

const stage = new Stage([orderPayout3, orderPayout4]);
bot.use(session());
bot.use(stage.middleware());

bot.startPolling();