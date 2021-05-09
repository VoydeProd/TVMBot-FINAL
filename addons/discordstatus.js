const fs = require('fs');
const Utils = require('../modules/utils');
const CustomConfig = require('../modules/CustomConfig.js');
const config = new CustomConfig('./addon_configs/discordstatus.yml', {
    "Category_Name": 'Server Stats',
    "Bot_Count": true,
    "Human_Count": true,
    "Total_Members_Count": true,
    "Channel_Count": true,
    "Lang": {
        Bots: "Bots: ",
        Humans: "Humans: ",
        Total_Members: "Total Members: ",
        Channels: "Channels: "
    }
})

module.exports = async (bot) => {
    async function updateStats() {
        bot.guilds.cache.forEach(async guild => {
            const category = config.Category_Name ? Utils.findChannel(config.Category_Name, guild, 'category', false) : false;
            let channels = category ? {
                bots: category.children.find(c => c.name.startsWith(config.Lang.Bots)),
                humans: category.children.find(c => c.name.startsWith(config.Lang.Humans)),
                total_members: category.children.find(c => c.name.startsWith(config.Lang.Total_Members)),
                channels: category.children.find(c => c.name.startsWith(config.Lang.Channels))
            } : {
                    bots: guild.channels.cache.find(c => c.name.startsWith(config.Lang.Bots)),
                    humans: guild.channels.cache.find(c => c.name.startsWith(config.Lang.Humans)),
                    total_members: guild.channels.cache.find(c => c.name.startsWith(config.Lang.Total_Members)),
                    channels: guild.channels.cache.find(c => c.name.startsWith(config.Lang.Channels))
                }

            if (config.Bot_Count) {
                if (!channels.bots) {
                    guild.channels.create(config.Lang.Bots + guild.members.cache.filter(m => m.user.bot).size, { type: 'voice', parent: category.id, permissionOverwrites: [{ id: guild.id, deny: ['CONNECT', 'SPEAK'] }], parent: category ? category.id : undefined });
                } else {
                    channels.bots.setName(config.Lang.Bots + guild.members.cache.filter(m => m.user.bot).size);
                }
            } else {
                if (channels.bots) channels.bots.delete()
            }

            if (config.Human_Count) {
                if (!channels.humans) {
                    guild.channels.create(config.Lang.Humans + guild.members.cache.filter(m => !m.user.bot).size, { type: 'voice', parent: category.id, permissionOverwrites: [{ id: guild.id, deny: ['CONNECT', 'SPEAK'] }], parent: category ? category.id : undefined })
                } else {
                    channels.humans.setName(config.Lang.Humans + guild.members.cache.filter(m => !m.user.bot).size);
                }
            } else {
                if (channels.humans) channels.humans.delete()
            }

            if (config.Total_Members_Count) {
                if (!channels.total_members) {
                    guild.channels.create(config.Lang.Total_Members + guild.memberCount, { type: 'voice', parent: category.id, permissionOverwrites: [{ id: guild.id, deny: ['CONNECT', 'SPEAK'] }], parent: category ? category.id : undefined });
                } else {
                    channels.total_members.setName(config.Lang.Total_Members + guild.memberCount);
                }
            } else {
                if (channels.total_members) channels.total_members.delete()
            }

            if (config.Channel_Count) {
                if (!channels.channels) {
                    guild.channels.create(config.Lang.Channels + guild.channels.cache.size, { type: 'voice', permissionOverwrites: [{ id: guild.id, deny: ['CONNECT', 'SPEAK'] }], parent: category ? category.id : undefined });
                } else {
                    channels.channels.setName(config.Lang.Channels + guild.channels.cache.size);
                }
            } else {
                if (channels.channels) channels.channels.delete()
            }
        })
    }
    updateStats();
    setInterval(updateStats, 30000);
};