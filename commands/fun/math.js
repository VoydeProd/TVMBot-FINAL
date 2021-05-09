const Utils = require('../../modules/utils');
const Embed = Utils.Embed;
const lang = Utils.variables.lang;

const { Parser } = require('expr-eval');

module.exports = {
    name: "math",
    run: async (bot, message, args) => {
        if (args.length < 1) return message.channel.send(Embed({
            preset: 'invalidargs',
            usage: module.exports.usage
        }))

        try {
            const parser = new Parser();
            const expr = parser.evaluate(args.join(" "));

            message.channel.send(Embed({
                title: lang.FunModule.Commands.Math.Title,
                fields: [
                    {
                        name: lang.FunModule.Commands.Math.Fields[0],
                        value: args.join(" ")
                    },
                    {
                        name: lang.FunModule.Commands.Math.Fields[1],
                        value: expr
                    }
                ]
            }))
        } catch (err) {
            message.channel.send(Embed({
                preset: 'error',
                description: "An error occured while evaluating the equation."
            }))
        }
    },
    description: "Evaluate a math equation",
    usage: "math <equation>",
    aliases: []
}
// 295149   8501   2331638    ION__%%   1620018921   c56b68d3fe3af187da97e05f0f21bd452b633daa   2331638