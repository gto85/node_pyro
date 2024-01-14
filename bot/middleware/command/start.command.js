const { bot } = require('../../connections/token.connection');
const { saveUser } = require('../../common/sequelize/saveUser.sequelize');
const main = require('../../main');

bot.start(async (ctx) => {
    try {
        const login = String(ctx.chat.id);
        const username = ctx.chat.username ?? "anonymous";

        const result = await saveUser(login, username);
        console.log(result);

        return result;
    } catch (err) {
        console.log(err);
    }
});
main.start();