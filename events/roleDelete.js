const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, role) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("RoleDeleted")) return;

        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.RoleDeleted, role.guild);

        if (logs) logs.send(Utils.Embed({
            title: lang.LogSystem.RoleDeleted.Title,
            fields: [
                {
                    name: lang.LogSystem.RoleDeleted.Field,
                    value: role.name
                }
            ]
        }))
    }
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638