const Utils = require("./modules/utils.js");
const Embed = Utils.Embed;
const chalk = require('chalk');
const path = require('path');

module.exports = {
  addonPrefix: chalk.hex("#03fceb").bold("[59L-ADDON] "),
  reactEmojis: async function (number1, number2, msg) {
    if (number1 < 1 || number2 > 10) return console.log(`${module.exports.addonPrefix}${Utils.errorPrefix}Invalid reaction number`)
    while (number1 <= number2) {
      await msg.react(Utils.getEmoji(number1))
      ++number1
    }
  },
  loadAddon: function (file, ext) {
    console.log(module.exports.addonPrefix + chalk.hex("#03fceb").bold(`[${path.basename(file, ext)}]`) + ` has been loaded!`)
  },
  //The install command was made by the corebot staff team all the credit goes to them
  install: async function (commands) {
    return new Promise(async (resolve, reject) => {
      if (process.argv.slice(2).map(a => a.toLowerCase()).includes("--no-install")) return resolve();
      else {

        const { spawn } = require('child_process');

        const npmCmd = process.platform == "win32" ? 'npm.cmd' : 'npm';

        let cmds = []
        commands.forEach(cmd => {
          cmds.push(spawn(npmCmd, ['i', cmd]))
        })
        Promise.all(cmds
          .map((cmd, i) => {
            return new Promise(resolve => {
              console.log(module.exports.addonPrefix + "Running '" + commands[i] + "' command.")
              cmd.stdout.on('data', (data) => {
                console.log(data.toString().trim())
              })

              cmd.stderr.on('data', (data) => {
                console.log(chalk.red(data.toString().trim()));
              })

              cmd.on('exit', () => {
                resolve();
              })
            })
          }))
          .then(() => {
            resolve();
          })
      }
    })
  },
  setupDatabase: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        const SqlDatabase = require('better-sqlite3', { verbose: console.log });
        const db = new SqlDatabase('59LAddons.db');

        console.log(module.exports.addonPrefix + 'Database Setup');
        resolve(db);
      } catch (err) {
        reject(err);
      }
    })
  },
  createProgressBar: async function (value, maxvalue, size) {
    try {
    const percent = value / maxvalue
    const progress = Math.round((size * percent))
    const emptyProgress = size - progress
    const progressText = '■'.repeat(progress)
    const emptyText = '□'.repeat(emptyProgress)
    const percentageText = Math.round(percent * 100)
    return `${progressText + emptyText} ${percentageText}%`
    } catch (error) {
      return `Invalid Parameters`
    }
  }
}