const Utils = require("../../modules/utils.js");
const Embed = Utils.Embed;
const Discord = Utils.Discord;
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = {
    name: 'daily',
    run: async (bot, message, args) => {
        let time = (new Date(Math.floor(await Utils.variables.db.get.getDailyCoinsCooldown(message.member)))).getTime();
        if (time > (new Date()).getTime()) return message.channel.send(Embed({ preset: 'error', description: lang.CoinModule.Commands.Daily.Cooldown.replace(/{time}/g, Utils.getTimeDifference(new Date(), time)) }));

        let amount = config.Coins.Amounts.Daily * (config.Coins.Multipliers.Multiplies.Daily ? Utils.getMultiplier(message.member) : 1);
        let nextTime = new Date();
        nextTime.setHours(nextTime.getHours() + 24);

        await Utils.variables.db.update.coins.updateCoins(message.member, amount, 'add');
        await Utils.variables.db.update.coins.setDailyCooldown(message.member, nextTime.getTime())
        message.channel.send(Embed({ title: lang.CoinModule.Commands.Daily.Collected.replace(/{coins}/g, amount.toLocaleString()), color: config.EmbedColors.Success }))
    },
    description: "Get your daily coins",
    usage: 'daily',
    aliases: ['dailycoins']
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638