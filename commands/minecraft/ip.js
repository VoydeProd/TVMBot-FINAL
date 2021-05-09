const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const {config, lang, embeds} = Utils.variables;

module.exports = {
  name: 'ip',
  run: async (bot, message, args) => {
    message.channel.send(Utils.setupEmbed({
      configPath: embeds.Embeds.IP
    }));
  },
  description: "View the Minecraft server's IP",
  usage: 'ip',
  aliases: [
    'serverip'
  ]
}

// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638