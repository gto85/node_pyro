const { Markup } = require('telegraf');

const menuAccessNo = Markup.inlineKeyboard([
  Markup.button.callback('Купить доступ', 'buy_access'),
  Markup.button.callback('Профиль', 'profile'),
  Markup.button.callback('Информация', 'access_no_info'),
  Markup.button.callback('Тех. Поддержка', 'support_no'),
], { columns: 3 });

const menuAccessYes = Markup.inlineKeyboard([
  Markup.button.callback('Профиль', 'profile'),
  Markup.button.callback('Информация', 'access_yes_info'),
  Markup.button.callback('Запросить выплату', 'order_payout'),
  Markup.button.callback('Тех. Поддержка', 'support_yes'),
], { columns: 2 });

const menuAdmin = Markup.inlineKeyboard([
  Markup.button.callback('Информация', 'admin_info'),
  Markup.button.callback('Запросы на вывод', 'admin_list_order_payment'),
  Markup.button.callback('Прибыль', 'admin_profit'),
  Markup.button.callback('Выйти из админки', 'go_main_menu'),
], { columns: 2 });

const btnClose = Markup.inlineKeyboard([
  Markup.button.callback('❌', 'close'),
], { columns: 3 });

const menuBuyAccess = Markup.inlineKeyboard([
  Markup.button.callback('🔄 Проверить оплату', 'check_payment'),
  Markup.button.callback('Отменить покупку', 'cancel_payment'),
], { columns: 3 });

const btnBackToAdminMenu = Markup.inlineKeyboard([
  Markup.button.callback('Вернуться в админ меню', 'back_to_admin_menu'),
], { columns: 3 });

const adminOrderInfo = Markup.inlineKeyboard([
  Markup.button.callback('Удалить из списка', 'del_order'),
  Markup.button.callback('Выйти', 'back_to_admin_menu'),
], { columns: 3 });

module.exports = {
  menuAccessNo,
  menuAccessYes,
  menuAdmin,
  btnClose,
  menuBuyAccess,
  btnBackToAdminMenu,
  adminOrderInfo,
};