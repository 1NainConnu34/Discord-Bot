const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kicks a user from this server",

    options: [
        {
            name: "user",
            description: "The user you want to kick",
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: "reason",
            description: "The reason you want to kick.",
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user").value;
        const reason = interaction.options.get("reason")?.value || "No reason provided";
        let targetUser = null;

        await interaction.deferReply();

        try {
            targetUser = await interaction.guild.members.fetch(targetUserId);
        } catch (error) {
            await interaction.editReply(`Can't kick`);
            return;
        }

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't kick the owner of the server.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePostion = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't kick that user because he have the same/higher role than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePostion) {
            await interaction.editReply("I can't kick that user because he have the same/higher role than me.");
            return;
        }

        try {
            await targetUser.kick(reason);
            await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`);
            await targetUser.send(`You were kicked from ${interaction.guild.name}\nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error when kicking: ${error}.`);
            await interaction.editReply(`Can't kick`);
        }
    },
};
