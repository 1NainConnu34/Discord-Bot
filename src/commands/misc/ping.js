module.exports = {
    name: 'ping',
    description: 'Check the latency',
    callback: (client, interaction) => {
        interaction.reply(`Latency : ${client.ws.ping}ms`);
    },
};
