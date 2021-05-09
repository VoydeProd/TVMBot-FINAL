const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, ticket, executor, oldName, newName) => {

    if (!config.Tickets.Logs.Enabled) return;

    let guild = bot.guilds.cache.get(ticket.guild);
    let logs = Utils.findChannel(config.Tickets.Logs.Channel, guild);

    if (!logs) return;

    logs.send(Utils.Embed({
        title: lang.TicketModule.Logs.Tickets.Renamed.Title,
        fields: [
            { name: lang.TicketModule.Logs.Tickets.Renamed.Fields[0], value: `${ticket.channel_name} \n <#${ticket.channel_id}>` },
            { name: lang.TicketModule.Logs.Tickets.Renamed.Fields[1], value: executor },
            { name: lang.TicketModule.Logs.Tickets.Renamed.Fields[2], value: oldName },
            { name: lang.TicketModule.Logs.Tickets.Renamed.Fields[3], value: newName }
        ],
    }));
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638