const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const client = require('../../index.js');
const moment = require('moment');

function toDate (unixTimestamp) {  
    return new Date(
      unixTimestamp * 1000
    )
  }

module.exports = {
    name: "userinfo",
    description: "Get information about a user",

    options: [
        {
            name: "user",
            description: "The user you want to have info",
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user")?.value || null;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch((targetUserId != null ? targetUserId : interaction.user.id));
        const guild = client.guilds.cache.get(interaction.guild.id);
        const member = guild.members.cache.get((targetUserId != null ? targetUserId : interaction.user.id))
        let text_roles = "";
        let nb_roles = 0;

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }
        for (let i = 0; i < member._roles.length; i++) {
            let role = "";
            role = role.concat("<@&");
            role = role.concat(member._roles[i]);
            role = role.concat("> ");
            if (i != 0) {
                text_roles = text_roles.concat(" ");
            }
            text_roles = text_roles.concat(role);
            nb_roles++;
        }
        const embedInfo = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: targetUser.user.username + "#" + targetUser.user.discriminator, iconURL: targetUser.user.avatarURL() })
            .setDescription(`<@${(targetUserId != null ? targetUserId : interaction.user.id)}>`)
            .setThumbnail(targetUser.user.avatarURL())
            .addFields({ name: `ID`, value: (targetUserId != null ? targetUserId : interaction.user.id), inline: true })
            .addFields(
                { name: 'Account creation', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`, inline: true },
                { name: 'Join date', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`, inline: true },
            )
            .addFields({ name: `Roles (${nb_roles})`, value: text_roles })
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
        interaction.editReply({embeds: [embedInfo]});
    },
};
