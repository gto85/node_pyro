const {code} = require("telegraf/format");
require("dotenv").config();

const buy_access = `❕ Покупка доступа\n\n
🥝 Оплата qiwi:\n\n  
❕ Номер:     ${process.env.QIWI_NUMBER}\n
❕ Сумма:     ${process.env.ACCESS_COST} руб\n
❕ Комментарий:    ${code}`

const start_menu = `Здравствуйте, ${name}\n
Ваш id - ${id}\n
Вы находитесь в меню:`

const admin_menu = `Здравствуйте, ${name}\n
Вы находитесь в меню админа: `

const profile = `📰 Профиль\n\n
Ваше имя - ${name}\n  
Ваш id - ${id}\n
Доступ - ${access}`

const access_no_info = `❕ Информация о пирамиде\n\n
💥 Пирамида имеет 3-х уровневаю систему\n
💥 Оплачивая доступ вы получаете личную ссылку для приглашения пользователей\n
💥 За каждого пригл. пользователя который оплатил доступ вы получаете ${process.env.PERCENT_1 * 100} % от оплаты\n
💥 За каждого пригл. им пользователя вы получаете ${process.env.PERCENT_2 * 100} % от оплаты\n
💥 Далее ${process.env.PERCENT_3 * 100} % от оплаты\n
💥 Пригласив всего 1 активного пользователя вы можете получить более 100 тысяч рублей!!`

const access_yes_info = `⚠️ Информация\n\n
❕ Ваш реф. код - ${ref_code}\n
❕ Ваша реф. ссылка - ${ref_url}\n\n
💰 Ваш заработок - ${profit} руб\n
👥 Кол-во приглашенных людей - ${amount_invite_users}`

const support = `Если у вас есть вопрос/проблема напишите:\n\n
@login`

const admin_profit = `💰 Прибыть за все время составила - ${profit} рублей`

const admin_info = `Общая информация\n\n
Всего уникальных пользователей - ${users}\n
Кол-во людей оплативших доступ - ${deposit}\n`

const order_payment = `Запрос на вывод\n\n
ID запроса - ${id}\n
User_id - ${user_id}\n  
Имя - ${name}\n
Сумма - ${amount}\n
Дата - ${date}\n
QIWI - ${qiwi}`

const withdraw = `⚠️ Запрос выплаты\n\n
❕ Ваш баланс - ${balance} руб\n
❕ Мин. сумма выплаты - ${process.env.MIN_PAYOUT} руб\n\n
❕ Введите сумму которую хотите вывести: \n\n
❗️ Например: 500 или 764.34`

module.exports = {
  buy_access,
  start_menu,
  admin_menu,
  profile,
  access_no_info,
  access_yes_info,
  support,
  admin_profit,
  admin_info,
  order_payment,
  withdraw,
};