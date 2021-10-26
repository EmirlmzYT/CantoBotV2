const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "sıra",
  description: "Şu anda sıraya alınmış tüm şarkıları gösterir",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q", "sıra"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player.queue.current)
      return client.sendTime(
        message.channel,
        "❌ | **Şu anda hiçbir şey çalmıyor...**"
      );

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor("Çalmakta", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `[${player.queue.current.title}](${player.queue.current.uri})`
        )
        .addField("Talep Eden", `${player.queue.current.requester}`, true)
        .addField(
          "Süre",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());
      return message.channel.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10); //Sayfa başına kaç şarkı gösterilecek

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (t) =>
          `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(
            t.duration,
            {
              colonNotation: true,
            }
          )}\` **|** Talep Eden: ${t.requester}\n`
      ).join("\n");

      let Embed = new MessageEmbed()
        .setAuthor("Sıra", client.botconfig.IconURL)
        .setColor(client.botconfig.EmbedColor)
        .setDescription(
          `**Çalmakta:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Bir sonraki:** \n${SongsDescription}\n\n`
        )
        .addField("Toplam şarkı: \n", `\`${player.queue.totalSize - 1}\``, true)
        .addField(
          "Toplam uzunluk: \n",
          `\`${prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          })}\``,
          true
        )
        .addField("Talep Eden:", `${player.queue.current.requester}`, true)
        .addField(
          "Geçerli şarkı süresi:",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());

      return Embed;
    });

     if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
  },
  SlashCommand: {
    /*
    options: [
      {
          name: "sayfa",
          value: "[sayfa]",
          type: 4,
          required: false,
          description: "Görüntülemek istediğiniz kuyruğun sayfasını girin",
      },
  ],
  */
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **Şu anda hiçbir şey çalmıyor...**");

      if (!player.queue || !player.queue.length || player.queue === 0) {
        let QueueEmbed = new MessageEmbed()
          .setAuthor("Çalmakta", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField("Talep Eden", `${player.queue.current.requester}`, true)
          .addField(
            "Süre",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail());
        return interaction.send(QueueEmbed);
      }

      let Songs = player.queue.map((t, index) => {
        t.index = index;
        return t;
      });

      let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

      let Pages = ChunkedSongs.map((Tracks) => {
        let SongsDescription = Tracks.map(
          (t) =>
            `\`${t.index + 1}.\` [${t.title}](${
              t.uri
            }) \n\`${prettyMilliseconds(t.duration, {
              colonNotation: true,
            })}\` **|** Talep Eden: ${t.requester}\n`
        ).join("\n");

        let Embed = new MessageEmbed()
          .setAuthor("Sıra", client.botconfig.IconURL)
          .setColor(client.botconfig.EmbedColor)
          .setDescription(
            `**Çalmakta:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Bir sonraki:** \n${SongsDescription}\n\n`
          )
          .addField(
            "Toplam şarkı: \n",
            `\`${player.queue.totalSize - 1}\``,
            true
          )
          .addField(
            "Toplam uzunluk: \n",
            `\`${prettyMilliseconds(player.queue.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField("Talep Eden:", `${player.queue.current.requester}`, true)
          .addField(
            "Geçerli şarkı süresi:",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail());

        return Embed;
      });

      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);
      else client.Pagination(interaction, Pages);
    },
  },
};
