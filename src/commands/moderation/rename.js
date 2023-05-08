const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "rename",
    description: "Rename a user from this server",

    options: [
        {
            name: "user",
            description: "The user you want to rename",
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: "nickname",
            description: "The nickname for the user",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageNicknames],
    botPermissions: [PermissionFlagsBits.ManageNicknames],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user").value;
        const nickname = interaction.options.get("nickname").value;

        const targetUser = await interaction.guild.members.fetch(targetUserId);
        const guild = client.guilds.cache.get(interaction.guild.id);
        //const member = guild.members.cache.get((targetUserId != null ? targetUserId : interaction.user.id))

        if (!targetUser) {
            await interaction.reply({content: "That user doesn't exist in this server.", ephemeral: true});
            return;
        }
        
        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePostion = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.reply({content: "You can't rename that user because he have the same/higher role than you.", ephemeral: true});
            return;
        }

        if (targetUserRolePosition >= botRolePostion) {
            await interaction.reply({content: "I can't rename that user because he have the same/higher role than me.", ephemeral: true});
            return;
        }
        try {
            await targetUser.setNickname(nickname);
            await interaction.reply({content: `User ${targetUser} got renamed into ${nickname}`, ephemeral: true});
        } catch (error) {
            console.log(`There was an error when renaming: ${error}.`);
            await interaction.reply({content: `Cannot rename`, ephemeral: true});
        }
    },
};
