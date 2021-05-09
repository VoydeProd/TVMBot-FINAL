const Utils = require('../modules/utils.js');
const config = Utils.variables.config;
const lang = Utils.variables.lang;

module.exports = async (bot, channel) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!channel.guild || !config.Logs.Enabled.includes("ChannelCreated")) return;
        if (channel.name.startsWith('ticket-') || channel.name.startsWith('application-')) return;

        const logs = Utils.findChannel(config.Logs.Channels.ChannelCreated, channel.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.ChannelCreated.Title,
            fields: [
                {
                    name: lang.LogSystem.ChannelCreated.Fields[0],
                    value: (channel.type == 'text' || channel.type == 'news' || channel.type == 'store') ? `<#${channel.id}>` : channel.name
                },
                {
                    name: lang.LogSystem.ChannelCreated.Fields[1],
                    value: channel.type.charAt(0).toUpperCase() + channel.type.substring(1)
                }
            ]
        }))

    }
}
// 295149   8501   2331638    N__%%   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638