const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "remove_role",
    description: "Remove a role to a user",

    options: [
        {
            name: "user",
            description: "The user you want to remove a role",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: "role",
            description: "The role you want to remove",
            required: true,
            type: ApplicationCommandOptionType.Role,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles],
    botPermissions: [PermissionFlagsBits.ManageRoles],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user").value;
        const targetRoleId = interaction.options.get("role").value;
        let targetUser = null;
        let targetRole = null;

        await interaction.deferReply();

        try {
            targetUser = await interaction.guild.members.fetch(targetUserId);
        } catch (error) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        try {
            targetRole = interaction.guild.roles.cache.find(r => r.id === targetRoleId);
        } catch (error) {
            await interaction.editReply("That role doesn't exist in this server.");
            return;
        }
        const addRolePosition = targetRole.rawPosition;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePostion = interaction.guild.members.me.roles.highest.position;

        if (addRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) {
            await interaction.editReply("You can't remove a higher role or the same role as your highest role.");
            return;
        }

        if (addRolePosition >= botRolePostion) {
            await interaction.editReply("I can't remove a higher role or the same role as my highest role.");
            return;
        }

        try {
            await targetUser.roles.remove(targetRole);
            await interaction.editReply(`${targetRole} role has been successfully removed from ${targetUser}`);
        } catch (error) {
            console.log(`There was an error when adding a role: ${error}.`);
            await interaction.editReply(`Can't remove the role`);
        }
    },
};
