const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

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
        let textRoles = "";
        let nbRoles = 0;

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
                textRoles = textRoles.concat(" ");
            }
            textRoles = textRoles.concat(role);
            nbRoles++;
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
            .addFields({ name: `Roles (${nbRoles})`, value: textRoles })
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
        interaction.editReply({embeds: [embedInfo]});
    },
};
