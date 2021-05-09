const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, emoji) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("EmojiDeleted")) return;
        
        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.EmojiDeleted, emoji.guild);
        
        logs.send(Utils.Embed({
            title: lang.LogSystem.EmojiDeleted.Title,
            fields: [
                {
                    name: lang.LogSystem.EmojiDeleted.Fields[0],
                    value: emoji.name
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[1],
                    value: emoji.id
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[2],
                    value: emoji.animated ? "Yes" : "No"
                }, {
                    name: lang.LogSystem.EmojiDeleted.Fields[3],
                    value: `[Click Here](${emoji.url})`
                }
            ],
            timestamp: Date.now()
        }))
    }
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638