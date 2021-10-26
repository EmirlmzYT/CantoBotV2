const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "geç",
  description: `Sıradaki bir şarkıya atla`,
  usage: "<sayı>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

    if (!player) return client.sendTime(message.channel, "❌ | **Şu anda hiçbir şey çalmıyor...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız!**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**");

    try {
      if (!args[0]) return client.sendTime(message.channel, `**Kullanım**: \`${GuildDB.prefix}geç [sayı]\``);
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size) return client.sendTime(message.channel, `❌ | O şarkı sırada değil! Lütfen tekrar deneyin!`);
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return client.sendTime(message.channel, `⏭ \`${Number(args[0] - 1)}\` şarkı atlandı`);
    } catch (e) {
      console.log(String(e.stack).bgRed);
      client.sendError(message.channel, "Bir şeyler yanlış gitti.");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "pozisyon",
        value: "[pozisyon]",
        type: 4,
        required: true,
        description: "Sıradaki belirli bir şarkıya atlar",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız.**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `:x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**`);
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(interaction, "❌ | **Lavalink düğümü bağlı değil**");
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      try {
        if (!interaction.data.options) return client.sendTime(interaction, `**Kullanım**: \`${GuildDB.prefix}geç <sayı>\``);
        let skipTo = interaction.data.options[0].value;
        //if the wished track is bigger then the Queue Size
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, `❌ | That song is not in the queue! Please try again!`);

        player.stop(skipTo);
        //Send Success Message
        return client.sendTime(interaction, `⏭ \`${Number(skipTo)}\` şarkı atlandı`);
      } catch (e) {
        console.log(String(e.stack).bgRed);
        client.sendError(interaction, "Bir şeyler yanlış gitti.");
      }
    },
  },
};
