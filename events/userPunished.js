const Utils = require("../modules/utils.js");
const { config, lang } = Utils.variables;
const { capitalize } = require("lodash");

module.exports = async (bot, punishment, user, executor) => {
    if (!config.Moderation.Logs.Enabled) return;

    let logs = Utils.findChannel(config.Moderation.Logs.Channel, user.guild);
    let id = await Utils.variables.db.get.getPunishmentID()
    if (!logs) return;

    if (punishment.type.startsWith("temp")) {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserTempPunished.Title,
            footer: lang.ModerationModule.Logs.UserTempPunished.Footer.replace(/{id}/g, id),
            timestamp: punishment.time,
            fields: [
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[2], value: capitalize(punishment.type) },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[3], value: punishment.reason },
                { name: lang.ModerationModule.Logs.UserTempPunished.Fields[4], value: Utils.DDHHMMSSfromMS(punishment.length) }
            ]
        }))
    } else if (punishment.type == "warn") {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserWarned.Title,
            footer: lang.ModerationModule.Logs.UserWarned.Footer.replace(/{id}/g, punishment.id),
            timestamp: punishment.time,
            fields: [
                { name: lang.ModerationModule.Logs.UserWarned.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[2], value: "Warn" },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[3], value: punishment.reason },
                { name: lang.ModerationModule.Logs.UserWarned.Fields[4], value: punishment.warnCount }
            ]
        }))
    } else {
        logs.send(Utils.Embed({
            title: lang.ModerationModule.Logs.UserPunished.Title,
            timestamp: punishment.time,
            footer: lang.ModerationModule.Logs.UserPunished.Footer.replace(/{id}/g, id),
            fields: [
                { name: lang.ModerationModule.Logs.UserPunished.Fields[0], value: user },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[1], value: executor },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[2], value: capitalize(punishment.type) },
                { name: lang.ModerationModule.Logs.UserPunished.Fields[3], value: punishment.reason }
            ]
        }))
    }
}
// 295149   8501   2331638    63250   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638