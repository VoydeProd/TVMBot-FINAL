const Utils = require('../modules/utils');
const Embed = Utils.Embed;
const { lang, config } = Utils.variables;

module.exports = (bot, channel) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!channel.guild || !config.Logs.Enabled.includes("ChannelPinsUpdated")) return;

        const logs = Utils.findChannel(config.Logs.Channels.ChannelPinsUpdated, channel.guild);

        logs.send(Embed({
            title: lang.LogSystem.ChannelPinsUpdated.Title,
            fields: [
                {
                    name: lang.LogSystem.ChannelPinsUpdated.Fields[0],
                    value: `<#${channel.id}>`
                }
            ],
            timestamp: Date.now()
        }))
    }
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638