const Utils = require("../modules/utils.js");
const { config, lang, commands, embeds } = Utils.variables;
const Embed = Utils.Embed;
const CommandHandler = require('../modules/handlers/CommandHandler');
const eventHandler = require('../modules/handlers/EventHandler');
const CustomConfig = require('../modules/CustomConfig.js');
const utilsPlus = require("../59Utils.js");

module.exports = async bot => {
    const addonConfig = new CustomConfig("./addon_configs/messageReminder.yml", {
        RequiredRole: 'management',
        Embeds: {
            Success: {
                Reminder: {
                    Title: 'Message reminder',
                    Description: '{message}',
                    Footer: 'React to this message once you have been notified'
                },
                List: {
                    Title: 'Message Reminders',
                    Description: '{list}',
                    Footer: 'Disable a reminder with -disableBump <True/False>'
                },
                UpdatedReminder: {
                    Title: 'Reminder updated',
                    Description: 'That reminder\'s status has been set to ``{status}``'
                }
            },
            Errors: {
                Title: 'Invalid Id',
                Description: 'There was a problem fetching the reminder with that id. Try another',
            }
        }
    })
    //Command
    const db = await utilsPlus.setupDatabase()
    db.prepare('CREATE TABLE IF NOT EXISTS messageReminder(id INTEGER PRIMARY KEY AUTOINCREMENT, guild TEXT, channel TEXT, message TEXT, timeout INTEGER, lastUpdate INTEGER, mentions TEXT, status INTEGER)').run();
    CommandHandler.set({
        name: 'bumpcreate',
        run: async (bot, message, args) => {
            let role = Utils.findRole(addonConfig.RequiredRole, message.guild)
            if (!role) return message.channel.send(Embed({ preset: 'console' }));
            if (!Utils.hasPermission(message.member, addonConfig.RequiredRole)) return message.channel.send(Embed({ preset: 'nopermission' }))
            let addReminder = db.prepare('INSERT INTO messageReminder(guild, channel, message, timeout, lastUpdate, mentions, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
            const time_pattern = /^(\d+((h|H)|(d|D)|(m|M)))+$/;
            const time = args[0]
            const msg = args.slice(2).join(' ')
            const channel = message.mentions.channels.first()
            if (!time || time && !time_pattern.test(time) || !channel || !msg) return message.channel.send(Embed({ preset: 'invalidargs', usage: 'Bumpcreate <1m/1h.1d/1w> <channel> <msg>' }))
            function getTimeElement(letter) {
                const find = time.toLowerCase().match(new RegExp(`\\d+${letter}`));
                return parseInt(find ? find[0] : 0);
            }
            const mins = getTimeElement("m");
            const hours = getTimeElement("h");
            const days = getTimeElement("d");
            const weeks = getTimeElement("w");

            let total = 0;
            total += mins * 60000;
            total += hours * 60 * 60000;
            total += days * 24 * 60 * 60000;
            total += weeks * 7 * 24 * 60 * 60000;
            mentions = {}
            mentionedUsers = []
            mentionedRoles = []
            message.mentions.members.map(m => { mentionedUsers.push(m.id) })
            message.mentions.roles.map(m => { mentionedRoles.push(m.id) })
            mentions.users = mentionedUsers
            mentions.roles = mentionedRoles
            addReminder.run(message.guild.id, message.mentions.channels.first().id, msg, total, Date.now(), JSON.stringify(mentions), 1)
            channel.send(Utils.setupEmbed({
                configPath: addonConfig.Embeds.Success.Reminder,
                variables: [
                    { searchFor: /{message}/g, replaceWith: msg },
                ]
            }))
            mentions.users.length > 0  || mentions.roles.length > 0 ? channel.send(mentions.users.map(u => `<@${u}> `) + mentions.roles.map(u => `<@&${u}> `).join('')) : null
        },
        description: "Make a repeating bump",
        usage: 'bumpcreate <1m/1h.1d/1w> <channel> <channel> <msg>',
        aliases: [],
        type: 'management'
    })
    CommandHandler.set({
        name: 'bumpDisable',
        run: async (bot, message, args) => {
            let role = Utils.findRole(addonConfig.RequiredRole, message.guild)
            if (!role) return message.channel.send(Embed({ preset: 'console' }));
            if (!Utils.hasPermission(message.member, addonConfig.RequiredRole)) return message.channel.send(Embed({ preset: 'nopermission' }))
            let updateReminder = db.prepare('UPDATE messageReminder SET status=? WHERE id=?')
            const id = args[0]
            const status = args[1] ? args[1].toLowerCase() : null
            if (!status || status && !['true', 'false'].includes(status) || !id) return message.channel.send(Embed({ preset: 'invalidargs', usage: 'disableBump <true/false>' }))
            if (!await db.prepare('SELECT * FROM messageReminder WHERE id = ?').get(id)) return message.channel.send(Utils.setupEmbed({
                configPath: addonConfig.Embeds.Errors.InvalidId
            }))
            updateReminder.run(status == 'true' ? 1 : 0, id)
            message.channel.send(Utils.setupEmbed({
                configPath: addonConfig.Embeds.Success.UpdatedReminder,
                variables: [
                    { searchFor: /{status}/g, replaceWith: status },
                ]
            }))
        },
        description: "Make a repeating reminder",
        usage: 'bumpDisable <id> <true/false>',
        aliases: [],
        type: 'management'
    })
    CommandHandler.set({
        name: 'bumplist',
        run: async (bot, message, args) => {
            let role = Utils.findRole(addonConfig.RequiredRole, message.guild)
            if (!role) return message.channel.send(Embed({ preset: 'console' }));
            if (!Utils.hasPermission(message.member, addonConfig.RequiredRole)) return message.channel.send(Embed({ preset: 'nopermission' }))
            let page = args[0] ? parseInt(args[0]) : 1
            let reminders = db.prepare('SELECT * FROM messageReminder WHERE guild=?').all(message.guild.id)
            let description = ""
            reminders.sort((a, b) => b.id + a.id).slice((page - 1) * 15, 15 * page).map(r => {
                description += `**${r.id}.** ${r.message.length > 10 ? r.message.substring(0, 10) + '...' : r.message} \`\`${r.status == 1 ? 'Enabled' : 'Disabled'}\`\`\n`
            })
            message.channel.send(Utils.setupEmbed({
                configPath: addonConfig.Embeds.Success.List,
                variables: [
                    { searchFor: /{list}/g, replaceWith: description },
                ]
            }))
        },
        description: "List all current bumps",
        usage: 'bumplist <page>',
        aliases: [],
        type: 'management'
    })
    async function checkMessages() {
        const messageReminders = db.prepare('SELECT * FROM messageReminder WHERE status=?').all(1)
        messageReminders.forEach(g => {
            if (g.lastUpdate + g.timeout < Date.now()) {
                let guild = bot.guilds.cache.get(g.guild)
                let channel = guild.channels.cache.get(g.channel)
                let mentions = JSON.parse(g.mentions)
                channel.send(Utils.setupEmbed({
                    configPath: addonConfig.Embeds.Success.Reminder,
                    variables: [
                        { searchFor: /{message}/g, replaceWith: g.message },
                    ]
                }))
                let m = [];
                if (mentions.users.length > 0) {
                    mentions.users.map(u => m.push(`<@${u}>`))
                }
                if (mentions.roles.length > 0) {
                    mentions.roles.map(u => m.push(`<@&${u}>`))
                }
                m.length > 0 ? channel.send(m.join(' ')) : null
                db.prepare('UPDATE messageReminder SET lastUpdate=? WHERE id=?').run(Date.now() + g.timeout, g.id)
            }
        })
    }
    setInterval(async function () {
        checkMessages()
    }, 60000)
    utilsPlus.loadAddon(__filename, '.js')
}