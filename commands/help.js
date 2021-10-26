const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "yardım",
  description: "bot hakkında bilgi",
  usage: "[komut]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd", "yardım"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
            .setAuthor(
               `${client.user.username} Yardım Menüsü`,
              client.botconfig.IconURL
            )
            .setColor(client.botconfig.EmbedColor)
            .setFooter(
              `Her bir komut türü hakkında bilgi almak için ${
                GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
              }help [komut] | İyi Günler Dilerim Mümin Kardeşim!`
            ).setDescription(`${Commands.join("\n")}
  
  Discord Müzik Bot Sürümü: v${require("../package.json").version}
  [✨ Destek Sunucusu](${
    client.botconfig.SupportServer
  }) | By [Emirlmz](https://www.youtube.com/Emirlmz)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(message.channel, `❌ | Bu komut bulunamadı.`);

      let embed = new MessageEmbed()
        .setAuthor(`Komut: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Takma Adları", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Kullanım",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "İzinler",
          "Üye: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Prefix - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

SlashCommand: {
    options: [
      {
        name: "command",
        description: "Belirli bir komut hakkında bilgi alın",
        value: "command",
        type: 3,
        required: false
      },
    ],
    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );
  
      let Embed = new MessageEmbed()
            .setAuthor(
              `${client.user.username} Yardım Menüsü`,
              client.botconfig.IconURL
            )
            .setColor(client.botconfig.EmbedColor)
            .setFooter(
              `Her bir komut türü hakkında bilgi almak için ${
                GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
              }help [komut] |  İyi Günler Dilerim Mümin Kardeşim!`
            ).setDescription(`${Commands.join("\n")}
  
  Discord Müzik Bot Sürümü: v${require("../package.json").version}
  [✨ Destek Sunucusu](${
    client.botconfig.SupportServer
  }) | By [Emirlmz](https://www.youtube.com/Emirlmz)`);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find((x) => x.aliases && x.aliases.includes(args[0].value));
        if (!cmd)
          return client.sendTime(interaction, `❌ | Bu komut bulunamadı.`);
  
        let embed = new MessageEmbed()
          .setAuthor(`Komut: ${cmd.name}`, client.botconfig.IconURL)
          .setDescription(cmd.description)
          .setColor("GREEN")
          //.addField("Name", cmd.name, true)
          .addField("Takma Adlar", cmd.aliases.join(", "), true)
          .addField(
            "Kulanım",
            `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "İzinler",
            "Üye: " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Prefix - ${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }`
          );
  
        interaction.send(embed);
      }
  },
}};
