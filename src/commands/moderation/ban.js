const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bans a user from this server",

    options: [
        {
            name: "user",
            description: "The user you want to ban",
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: "reason",
            description: "The reason you want to ban.",
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user").value;
        const reason = interaction.options.get("reason")?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban the owner of the server.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position;
        const requestUserRolePosition = interaction.member.roles.highest.position;
        const botRolePostion = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply("You can't ban that user because he have the same/higher role than you.");
            return;
        }

        if (targetUserRolePosition >= botRolePostion) {
            await interaction.editReply("I can't ban that user because he have the same/higher role than me.");
            return;
        }

        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`User ${targetUser} was banned\nReason: ${reason}`);
            await targetUser.send(`You were banned from ${interaction.guild.name}\nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error when banning: ${error}.`);
        }
    },
};