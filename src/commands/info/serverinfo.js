const { Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Get information about the server",

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const guild = client.guilds.cache.get(interaction.guild.id);
        let nbRoles = 0;
        let nbTextChannels = 0;
        let nbVoiceChannels = 0;
        let rolemap = interaction.guild.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .map(r => r)
                    .join(",");
                    if (!rolemap) rolemap = "";
        let guildmap = interaction.guild.channels.cache
                    .map(r => r)
                    .join(",")
                    .split(",");
        let textRoles = ""

        for (let i = 0; i < rolemap.length; i++) {
            textRoles = textRoles.concat(rolemap[i])
            if (rolemap[i] == ',') {
                textRoles = textRoles.concat(" ")
                nbRoles++;
            }
        }
        if ((nbRoles == 0 && rolemap.length != 0) || nbRoles != 0) {
            nbRoles++;
        }
        guildmap.forEach(elem => {
            let channelId = ""
            for (let i = 2; i < elem.length - 1; i++) {
                channelId = channelId.concat(elem[i]);
            }
            const channelObject = interaction.guild.channels.cache.get(channelId);
            if (channelObject.type === 2) {
                nbVoiceChannels++;
            }
            if (channelObject.type === 0) {
                nbTextChannels++;
            }
        });

        const membersOnline = guild.members.cache.filter(member => member.presence?.status == "online" || member.presence?.status == "idle" || member.presence?.status == "dnd").size;
        const membersOffline = guild.members.cache.filter(member => !member.presence || member.presence.status == "offline").size;
        const emojisName = guild.emojis.cache.map(e => e.name);
        const emojisId = guild.emojis.cache.map(e => e.id);
        let emojisText = ""
        for (let i = 0; i < emojisName.length; i++) {
            emojisText = emojisText.concat("<:");
            emojisText = emojisText.concat(emojisName[i]);
            emojisText = emojisText.concat(":");
            emojisText = emojisText.concat(emojisId[i]);
            emojisText = emojisText.concat(">");
            if (i + 1 < emojisName.length) {
                emojisText = emojisText.concat(" ");
            }
        }
        const embedInfo = new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: guild.name })
            .addFields(
                { name: `Owner`, value: `<@${guild.ownerId}>`, inline: true },
                { name: `Server ID`, value: guild.id, inline: true },
                { name: 'Server creation', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:f>`, inline: true },
                { name: `Channels (${nbTextChannels + nbVoiceChannels})`, value: `Text Channel: ${nbTextChannels}\nVoice Channel: ${nbVoiceChannels}`, inline: true },
                { name: `Members (${membersOffline + membersOnline})`, value: `Online: ${membersOnline}\nOffline: ${membersOffline}`, inline: true },
            )
            .addFields({ name: `Emojis (${emojisName.length})`, value: emojisText, inline: true})
            .addFields({ name: `Roles (${nbRoles})`, value: textRoles })
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
        interaction.editReply({embeds: [embedInfo]});
    },
};
