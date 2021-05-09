const Utils = require('../modules/utils');
const { config, lang } = Utils.variables;

module.exports = async (bot, oldEmoji, newEmoji) => {
    if (require('../modules/handlers/CommandHandler.js').commands.length > 0 && require('../modules/handlers/KeyHandler.js').verified) {
        if (!Utils.variables.config.Logs.Enabled.includes("EmojiUpdated")) return;
        
        const logs = Utils.findChannel(Utils.variables.config.Logs.Channels.EmojiUpdated, newEmoji.guild);
        
        logs.send(Utils.Embed({
            title: lang.LogSystem.EmojiUpdated.Title,
            fields: [
                {
                    name: lang.LogSystem.EmojiUpdated.Fields[0],
                    value: oldEmoji.name
                }, {
                    name: lang.LogSystem.EmojiUpdated.Fields[1],
                    value: newEmoji.name
                }, {
                    name: lang.LogSystem.EmojiUpdated.Fields[2],
                    value: `<:${newEmoji.name}:${newEmoji.id}>`
                }
            ],
            timestamp: Date.now()
        }))
    }
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638