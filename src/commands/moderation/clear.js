const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const client = require('../../index.js');

async function deleteMessage(number, targetUserId, channelId) {
    let channel = client.channels.cache.get(channelId);
    let messages = []
    let lastMessage = [channel.lastMessage];
    let noFetch = false;
    let numberDeleted = 0;

    while (number > 0) {
        await channel.messages
            .fetch({ limit: 100, before: lastMessage[0]?.id })
            .then(messagePage => {
                messagePage.forEach(msg => messages.push(msg))});
        lastMessage = [];
        if (messages.length == 0) {
            return numberDeleted;
        }
        await channel.messages
            .fetch({ limit: 1, before: messages[messages.length - 1].id})
            .then(messagePage => {
                messagePage.forEach(msg => lastMessage.push(msg))});
        if (lastMessage.length == 0) {
            noFetch = true;
        }
        if (lastMessage[0] != null) {
            messages.unshift(lastMessage[0]);
        }
        if (targetUserId != null) {
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].author.id != targetUserId) {
                    messages.splice(i, 1);
                }
            }
        }
        if (messages.length > number) {
            while (messages.length != number) {
                messages.pop();
            }
        }
        await channel.bulkDelete(messages);
        number -= messages.length;
        numberDeleted += messages.length;
        if (noFetch) {
            return numberDeleted;
        }
    }
    return numberDeleted;
}

module.exports = {
    name: "clear",
    description: "Clear message in this channel",

    options: [
        {
            name: "number",
            required: true,
            description: "The number of message you want to delete.",
            type: ApplicationCommandOptionType.Integer,
        },
        {
            name: "user",
            description: "The user you want to delete message",
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get("user")?.value || null;
        const number = interaction.options.get("number").value;

        await interaction.deferReply();

        if (number <= 0) {
            await interaction.editReply( {content: "The number of message to delete must be at least 1.", ephemeral: true})
                .then(msg => {
                    setTimeout(() => {
                        msg.channel.messages
                        .fetch(msg.id)
                        .then((fetchedMessage) => {
                        console.log('Message exists');
    
                        fetchedMessage
                            .delete()
                            .then(() => console.log('Message deleted successfully'))
                            .catch((err) => console.log('Could not delete the message', err));
                        })
                        .catch((err) => {
                            if (err.httpStatus === 404) {
                                console.log('Message already deleted');
                            } else {
                                console.log("Message already deleted");
                            }
                            });
                        }, 5000);
                    });
            return;
        }

        if (targetUserId != null) {
            const targetUser = await interaction.guild.members.fetch(targetUserId);

            if (!targetUser) {
                await interaction.editReply( {content: "That user doesn't exist in this server.", ephemeral: true})
                    .then(msg => {
                        setTimeout(() => {
                            msg.channel.messages
                            .fetch(msg.id)
                            .then((fetchedMessage) => {
                            console.log('Message exists');
        
                            fetchedMessage
                                .delete()
                                .then(() => console.log('Message deleted successfully'))
                                .catch((err) => console.log('Could not delete the message', err));
                            })
                            .catch((err) => {
                                if (err.httpStatus === 404) {
                                    console.log('Message already deleted');
                                } else {
                                    console.log("Message already deleted");
                                }
                                });
                            }, 5000);
                        });
                return;
            }
        }

        const numberMessageDeleted = await deleteMessage(number, targetUserId, interaction.channelId);
        if (targetUserId == null) {
            await interaction.editReply({content: `${numberMessageDeleted} messages deleted (this message will be deleted in less than a minute).`, ephemeral: true})
                .then(msg => {
                    setTimeout(() => {
                        msg.channel.messages
                        .fetch(msg.id)
                        .then((fetchedMessage) => {
                        console.log('Message exists');

                        fetchedMessage
                            .delete()
                            .then(() => console.log('Message deleted successfully'))
                            .catch((err) => console.log('Could not delete the message', err));
                        })
                        .catch((err) => {
                            if (err.httpStatus === 404) {
                                console.log('Message already deleted');
                            } else {
                                console.log("Message already deleted");
                            }
                            });
                        }, 40000);
                    });
        } else {
            await interaction.editReply({content: `${numberMessageDeleted} messages deleted from <@${targetUserId}> (this message will be deleted in less than a minute)`, ephemeral: true})
                .then(msg => {
                    setTimeout(() => {
                        msg.channel.messages
                        .fetch(msg.id)
                        .then((fetchedMessage) => {
                        console.log('Message exists');

                        fetchedMessage
                            .delete()
                            .then(() => console.log('Message deleted successfully'))
                            .catch((err) => console.log('Could not delete the message', err));
                        })
                        .catch((err) => {
                            if (err.httpStatus === 404) {
                                console.log('Message already deleted');
                            } else {
                                console.log("Message already deleted");
                            }
                            });
                        }, 40000);
                    });
        }
    },
};