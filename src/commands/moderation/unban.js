const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "unban",
    description: "Unban a user from this server",

    options: [
        {
            name: "user",
            description: "The user you want to unban",
            required: true,
            type: ApplicationCommandOptionType.User,
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

        await interaction.deferReply();

        //const targetUser = await interaction.guild.members.fetch(targetUserId);
        /*
        if (!targetUser) {
            await interaction.editReply("That user doesn't exist.");
            return;
        }
        */
        if (targetUserId === interaction.guild.ownerId) {
            await interaction.editReply("You can't unban the owner of the server.");
            return;
        }

        try {
            await interaction.guild.members.unban(targetUserId)
            await interaction.editReply(`User <@${targetUserId}> (${targetUserId}) was unbanned`);
        } catch (error) {
            await interaction.editReply(`Can't unban`);
        }
    },
};
