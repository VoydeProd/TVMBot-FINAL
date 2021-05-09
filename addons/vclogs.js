const fs = require('fs');
const request = require("request-promise");
const Embed =
    require('../modules/embed.js');
const Utils = require('../modules/utils');
module.exports = async (bot) => {
    const CustomConfig = require('../modules/CustomConfig.js');
    const config = new CustomConfig('./addon_configs/vclogs.yml', {
        "Log_Channel": "logs",
        "Embed_Color": "#3489eb"
    })
    require('../modules/handlers/EventHandler').set('voiceStateUpdate', (bot, oldState, newState) => {
        if (!oldState.channel && newState.channel) {
            // Member joined channel
            const channel = Utils.findChannel(config.Log_Channel, oldState.guild);
            if (!channel) return;
            channel.send(Embed({ fields: [{ name: 'Channel', value: `${newState.channel.name} (${newState.channel.id})` }, { name: 'User', value: `<@${oldState.member.id}> (${oldState.member.id})` }, { name: 'User Tag', value: `${oldState.member.user.tag}` }, { name: 'Time', value: new Date().toLocaleString() }], timestamp: new Date(), title: 'User Joined Channel', color: config.Embed_Color }))
        } else if (oldState.channel && !newState.channel) {
            // Member left channel
            const channel = Utils.findChannel(config.Log_Channel, oldState.guild);
            if (!channel) return;
            channel.send(Embed({ fields: [{ name: 'Channel', value: `${oldState.channel.name} (${oldState.channel.id})` }, { name: 'User', value: `<@${oldState.member.id}> (${oldState.member.id})` }, { name: 'User Tag', value: `${oldState.member.user.tag}` }, { name: 'Time', value: new Date().toLocaleString() }], timestamp: new Date(), title: 'User Left Channel', color: config.Embed_Color }))
        }
    })
};