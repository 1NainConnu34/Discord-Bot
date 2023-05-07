const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client_button = require('../../index.js');

const info_game = [];

function create_game() {
    return [['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']];
}

function checkWin(game) {
    for (let i = 0; i < 3; i++) {
        if (game[i][0] != '.' &&
        game[i][0] == game[i][1] &&
        game[i][0] == game[i][2]) {
            game[i][0] = "W";
            game[i][1] = "W";
            game[i][2] = "W";
            return game[i][0];
        }
        if (game[0][i] != '.' &&
        game[0][i] == game[1][i] &&
        game[0][i] == game[2][i]) {
            game[0][i] = "W";
            game[1][i] = "W";
            game[2][i] = "W";
            return game[0][i];
        }
    }
    if (game[0][0] != '.' &&
    game[0][0] == game[1][1] &&
    game[0][0] == game[2][2]) {
        game[0][0] = "W";
        game[1][1] = "W";
        game[2][2] = "W";
        return game[0][0];
    }
    if (game[0][2] != '.' &&
    game[0][2] == game[1][1] &&
    game[0][2] == game[2][0]) {
        game[0][2] = "W";
        game[1][1] = "W";
        game[2][0] = "W";
        return game[0][2];
    }
    return '.';
}

function checkDraw(game) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game[i][j] == '.')
                return 0;
        }
    }
    return 1;
}

function checkGameInList(id) {
    for (let i = 0; i < info_game.length; i++) {
        if (info_game[i].message_id == id)
            return i;
    }
    return -1;
}

function pushInfoMorpion(interaction) {
    const object = {};
    object.message_id = interaction.id;
    object.player1_id = interaction.user.id;
    object.buttons = "none";
    object.turn = object.player1_id;
    info_game.push(object);
    console.log('Donnée joueur 1 stocké');
}

function create_buttons(index_morp) {
    let blank = "<:Blank:1097122236818800661>";
    let emojiX = "❌";
    let emojiO = "⭕";
    let goodEmoji = blank;
    const row = new ActionRowBuilder()
        for (let j = 0; j < 3; j++) {
            if (info_game[index_morp].game[0][j] == ".") {
                goodEmoji = blank;
            }
            if (info_game[index_morp].game[0][j] == "X") {
                goodEmoji = emojiX;
            }
            if (info_game[index_morp].game[0][j] == "O") {
                goodEmoji = emojiO;
            }
            row.addComponents(
                button = new ButtonBuilder()
                    .setCustomId('button 0 ' + j + ' ' + info_game[index_morp].message_id)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(goodEmoji),
            );
        }
    const row2 = new ActionRowBuilder()
        for (let j = 0; j < 3; j++) {
            if (info_game[index_morp].game[1][j] == ".") {
                goodEmoji = blank;
            }
            if (info_game[index_morp].game[1][j] == "X") {
                goodEmoji = emojiX;
            }
            if (info_game[index_morp].game[1][j] == "O") {
                goodEmoji = emojiO;
            }
            row2.addComponents(
                button = new ButtonBuilder()
                    .setCustomId('button 1 ' + j + ' ' + info_game[index_morp].message_id)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(goodEmoji),
            );
        }
    const row3 = new ActionRowBuilder()
        for (let j = 0; j < 3; j++) {
            if (info_game[index_morp].game[2][j] == ".") {
                goodEmoji = blank;
            }
            if (info_game[index_morp].game[2][j] == "X") {
                goodEmoji = emojiX;
            }
            if (info_game[index_morp].game[2][j] == "O") {
                goodEmoji = emojiO;
            }
            row3.addComponents(
                button = new ButtonBuilder()
                    .setCustomId('button 2 ' + j + ' ' + info_game[index_morp].message_id)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(goodEmoji),
            );
        }
    info_game[index_morp].buttons = [row, row2, row3];
}

function modify_game(interaction, index_morp) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (info_game[index_morp].buttons[i].components[j].data.custom_id == interaction.customId) {
                if (info_game[index_morp].buttons[i].components[j].data.emoji.name != "Blank")
                    return "NOT EMPTY";
                if (info_game[index_morp].player1_id == info_game[index_morp].turn) {
                    info_game[index_morp].buttons[i].components[j].setEmoji("❌");
                    info_game[index_morp].game[i][j] = "X";
                    info_game[index_morp].turn = info_game[index_morp].player2_id;
                    return "GOOD";
                }
                else {
                    info_game[index_morp].buttons[i].components[j].setEmoji("⭕");
                    info_game[index_morp].game[i][j] = "O";
                    info_game[index_morp].turn = info_game[index_morp].player1_id;
                    return "GOOD";
                }
            }
        }
    }
}

function win_game(interaction, index_morp) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (info_game[index_morp].game[i][j] == "W") {
                info_game[index_morp].buttons[i].components[j].data.style = 3;
            }
            info_game[index_morp].buttons[i].components[j].setDisabled(true);
        }
    }
    if (info_game[index_morp].player1_id == info_game[index_morp].turn) {
        info_game[index_morp].turn = info_game[index_morp].player2_id;
    }
    else {
        info_game[index_morp].turn = info_game[index_morp].player1_id;
    }
}

function draw_game(interaction, index_morp) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            info_game[index_morp].buttons[i].components[j].setDisabled(true);
        }
    }
}

module.exports = {
    name: 'tic_tac_toe',
    description: 'Play a game of Tic Tac Toe',
    callback: async (client, interaction) => {
        if (interaction.commandName == 'tic_tac_toe') {
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Join Tic Tac Toe')
                        .setLabel('Join game')
                        .setEmoji("🎮")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('Cancel Tic Tac Toe')
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Secondary),
                );
            pushInfoMorpion(interaction);
            await interaction.reply({ content: 'Game created, waiting for someone to join...', components: [row] });
        }
    },
};

client_button.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        let index_morp = checkGameInList(interaction.message.interaction.id);
        if (index_morp != -1 && info_game[index_morp].buttons == "none" && interaction.user.id == info_game[index_morp].player1_id && interaction.customId === "Join Tic Tac Toe") {
            await interaction.reply({ content: "You can't join your own game", components: [], ephemeral : true });
            return;
        }
        if (index_morp != -1 && info_game[index_morp].buttons == "none" && interaction.user.id != info_game[index_morp].player1_id && interaction.customId === "Cancel Tic Tac Toe") {
            await interaction.reply({ content: "You can't cancel a game that you haven't created", components: [], ephemeral : true });
            return;
        }
        if (index_morp != -1 && info_game[index_morp].buttons == "none" && interaction.user.id == info_game[index_morp].player1_id && interaction.customId === "Cancel Tic Tac Toe") {
            info_game.splice(index_morp, 1);
            console.log("game cancelled");
            await interaction.message.delete();
            return;
        }
        if (index_morp != -1 && info_game[index_morp].buttons == "none") {
            info_game[index_morp].player2_id = interaction.user.id;
            info_game[index_morp].game = create_game();
            console.log('Donnée joueur 2 stocké');
            create_buttons(index_morp);
            console.log("Boutons initialisé");
            await interaction.update({ content: "It's " + '<@' + info_game[index_morp].turn + '> turn ( ❌ )', components: info_game[index_morp].buttons })
            return;
        }
        if (index_morp != -1 && info_game[index_morp].buttons != "none") {
            if (info_game[index_morp].player1_id != interaction.user.id && info_game[index_morp].player2_id != interaction.user.id) {
                await interaction.reply({ content: "You are not playing", components: [], ephemeral : true });
                return;
            }
            if (info_game[index_morp].turn != interaction.user.id) {
                await interaction.reply({ content: "It is not your turn", components: [], ephemeral : true });
                return;
            }
            if (info_game[index_morp].turn == interaction.user.id) {
                let check = modify_game(interaction, index_morp);
                if (check == "NOT EMPTY") {
                    await interaction.reply({ content: "This case is not empty, try another one", components: [], ephemeral : true });
                    return;
                }
                if (checkWin(info_game[index_morp].game) != '.') {
                    win_game(interaction, index_morp);
                    await interaction.update({ content: '<@' + info_game[index_morp].turn + '> won !', components: info_game[index_morp].buttons })
                    info_game.splice(index_morp, 1);
                    return;
                }
                if (checkDraw(info_game[index_morp].game)) {
                    draw_game(interaction, index_morp);
                    await interaction.update({ content: "It's a draw !", components: info_game[index_morp].buttons })
                    info_game.splice(index_morp, 1);
                    return;
                }
                if (info_game[index_morp].turn == info_game[index_morp].player1_id) {
                    await interaction.update({ content: `It's <@${info_game[index_morp].turn}> turn ( ❌ )`, components: info_game[index_morp].buttons })
                    return;
                }
                if (info_game[index_morp].turn == info_game[index_morp].player2_id) {
                    await interaction.update({ content: `It's <@${info_game[index_morp].turn}> turn ( ⭕ )`, components: info_game[index_morp].buttons })
                    return;
                }
            }
        }
    }
})
