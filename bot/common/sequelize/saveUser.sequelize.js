const db = require('../../connections/db.connection');
const UserModel = require('../../models/user.model');

exports.saveUser = async (login, username) => {

    await db.sync();

    const successMessage = `User ${login}-${username} is saved in the database.`;
    const updateMessage = `User ${login}-${username} has been updated in the database.`;

    const foundUser = await UserModel.findOne({ where: { login } });

    if(!foundUser) {
        await UserModel.create({ login, username });
        return successMessage;
    }

    if(foundUser.username !== username) {
        await UserModel.update({username: username}, {where: { login: login} });

    }
    return updateMessage;
};