const { serversList } = require('../../../config.json');
const fs = require("fs");

module.exports = async (client) => {
    try {
        let serversListBot = [];
        client.guilds.cache.forEach(guild => {
            serversListBot.push(guild.id);
        })
        for (let i = 0; i < serversListBot.length; i++) {
            let j = 0;
            for (; j < serversList.length; j++) {
                if (serversListBot[i] == serversList[j]) {
                    break;
                }
            }
            if (j == serversList.length) {
                serversList.push(serversListBot[i]);
            }
        }
        for (let i = 0; i < serversList.length; i++) {
            let j = 0;
            for (; j < serversListBot.length; j++) {
                if (serversList[i] == serversListBot[j]) {
                    break;
                }
            }
            if (j == serversListBot.length) {
                serversList.splice(i, 1);
            }
        }
        const JSON_FILE = "config.json";

        try {
            const jsonData = fs.readFileSync(JSON_FILE);
            const data = JSON.parse(jsonData);
            data["serversList"] = serversList;
            fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
            console.log("Bot servers list updated");
          } catch (error) {
            console.log(`There was an error when updating servers list (writing in .json file): ${error}`);
          }
    } catch (error) {
        console.log(`There was an error when updating servers list: ${error}`);
    }
};
