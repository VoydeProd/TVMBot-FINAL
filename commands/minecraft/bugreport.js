const Discord = require("discord.js");
const Utils = require("../../modules/utils.js")
const Embed = Utils.Embed;
const { config, lang, embeds } = Utils.variables;

module.exports = {
  name: 'bugreport',
  run: async (bot, message, args, { prefixUsed, commandUsed }) => {
    if (config.BugReports.Type.toLowerCase() == 'both' && [message.channel.name, message.channel.id].includes(config.BugReports.Channels.Pending)) return;
    let channel = Utils.findChannel(config.BugReports.Channels.Pending, message.guild);

    if (!channel) return message.channel.send(Embed({ preset: 'console' }));
    if (!args[0]) return message.channel.send(Embed({ preset: 'invalidargs', usage: module.exports.usage }));

    channel.send(Utils.setupEmbed({
      configPath: embeds.Embeds.BugReport,
      title: embeds.Embeds.BugReport.Title + lang.MinecraftModule.Commands.BugReports.PendingSuffix,
      variables: [
        ...Utils.userVariables(message.member, "user"),
        { searchFor: /{bug}/g, replaceWith: message.content.replace(prefixUsed + commandUsed, '') }
      ]
    }))

    message.channel.send(Utils.setupEmbed({
      configPath: embeds.Embeds.BugReported
    }))
  },
  description: "Report a bug on the server",
  usage: 'bugreport <bug>',
  aliases: [
    'bug'
  ]
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638