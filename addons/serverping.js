const Embed = require("../modules/utils").Embed;
const CustomConfig = require('../modules/CustomConfig.js');
const config = new CustomConfig('./addon_configs/serverping.yml', {
    "Command": "serverping",
    "Servers": {
        "Example": "example.com",
        "VPS": "your-ip-address:your-port"
    }
})

module.exports = async (bot) => {
    try {
        require.resolve('net');
    } catch (e) {
        console.error("net Must be installed for the Ping Addon to work! Attempting to install module...");
        require('child_process').exec('npm i net', function (err, stdout, stderr) {
            if (err) return console.log("Error:\n" + err);
            if (Stderr) return console.log("Error:\n" + err);
            return console.log('Output:\n' + stdout);
        })
    }

    const net = require('net');
    async function ping(host, port) {
        const start = Date.now();
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(function () {
                reject("Request timed out");
                socket.end();
            }, 5000);
            const socket = net.createConnection(port, host, () => {
                clearTimeout(timeout);
                resolve(Date.now() - start);
                socket.end();
            });
            socket.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
    }

    require('../modules/handlers/CommandHandler').set({
        name: config.Command,
        run: async function (bot, message, args) {
            const embed = Embed({ title: "Server Ping" })
            let fields = [];
            function getServer(servertitle) {
                return new Promise((resolve, reject) => {
                    const server = config.Servers[servertitle];
                    const ip = server.split(":")[0];
                    const port = server.split(":")[1] || '80';
                    
                    ping(ip, port, message)
                        .then(ms => {
                            fields.push({ name: "**" + servertitle + "**", value: (ms > 500 ? ':warning: ' : ':white_check_mark: ') + ms + " ms"})
                            resolve();
                        })
                        .catch(err => {
                            fields.push({ name: "**" + servertitle + "**", value: ":no_entry: Offline" })
                            resolve();
                        })
                })
            }
            Promise.all(Object.keys(config.Servers).map(title => getServer(title)))
                .then(() => {
                    embed.embed.fields = fields
                    message.channel.send(embed);
                })
        },
        description: 'Ping the servers',
        usage: config.Command,
        aliases: [

        ],
        type: 'addon'
    })
}