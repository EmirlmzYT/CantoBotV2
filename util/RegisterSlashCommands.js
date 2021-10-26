const fs = require("fs");
const path = require("path");

/**
 * Bir lonca için eğik çizgi komutları kaydedin
 * @param {require("../structures/DiscordMusicBot")} client
 * @param {string} guild
 */
module.exports = (client, guild) => {
  client.log("Eğik çizgi komutlarını kaydetme " + guild);

  let commandsDir = path.join(__dirname, "..", "commands");

  fs.readdir(commandsDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (file) => {
      let cmd = require(commandsDir + "/" + file);
      if (!cmd.SlashCommand || !cmd.SlashCommand.run) return;
      let dataStuff = {
        name: cmd.name,
        description: cmd.description,
        options: cmd.SlashCommand.options,
      };

      //Bunun gibi değişkenler oluşturmak, Böylece kodumu anlayabilirsiniz :)
      let ClientAPI = client.api.applications(client.user.id);
      let GuildAPI = ClientAPI.guilds(guild);

      client.log(
        "[Eğik çizgi komut]: [İLETİ] Lonca " +
          guild +
          ", Komut: " +
          dataStuff.name
      );
      try {
        await GuildAPI.commands.post({data: dataStuff});
      } catch (e) {
        client.log(
          "[Eğik çizgi komut]: [İLETİ-BAŞARISIZ] Lonca " +
            guild +
            ", Komut: " +
            dataStuff.name
        );
        console.log(e);
      }
    });
  });
};
