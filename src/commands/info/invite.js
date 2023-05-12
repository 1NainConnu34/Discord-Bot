const { Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "invite",
    description: "invite me to your server !",

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: "Add me to your server !", iconURL: client.user.avatarURL() })
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Click here to invite me')
                    .setStyle(ButtonStyle.Link)
                    .setURL(process.env.INVITE),
            );
        await interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    },
};
