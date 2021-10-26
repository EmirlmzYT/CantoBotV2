const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "çarp",
    description: "Bir parçayı kuyruğun önüne taşır.",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["b", "çarp"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **Şu anda hiçbir şey çalmıyor...**");
        if (!args[0]) return client.sendTime(message.channel, "❌ | **Geçersiz argümanlar.**");
        
		// Check if (args[0] - 1) is a valid index
		let trackNum = parseInt(args[0] - 1);
        if (trackNum < 1 || trackNum > player.queue.length - 1) {
			return client.sendTime(message.channel, "❌ | **Geçersiz parça numarası.**");
        }
        
        // Remove from and shift array
        const track = player.queue[trackNum];
        player.queue.splice(trackNum, 1);
        player.queue.unshift(track);
		client.sendTime(message.channel, "✅ | **" + track.title + "** sıranın önüne taşındı.");
    },

    SlashCommand: {
      options: [
          {
              name: "parça",
              value: "parça",
              type: 4,
              required: true,
              description: "Seçilen parçayı kuyruğun önüne taşır.",
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
            
            let player = await client.Manager.get(interaction.guild.id);
            if (!player) return client.sendTime(interaction, "❌ | **Şu anda hiçbir şey çalmıyor...**");
            if (!args[0].value) return client.sendTime(interaction, "❌ | **Geçersiz parça numarası.**");
            
            // Check if (args[0] - 1) is a valid index
            let trackNum = parseInt(args[0].value - 1);
            if (trackNum < 1 || trackNum > player.queue.length - 1) {
                return client.sendTime(interaction, "❌ | **Geçersiz parça numarası.**");
            }

            // Remove from and shift array
            const track = player.queue[trackNum];
            player.queue.splice(trackNum, 1);
            player.queue.unshift(track);
            client.sendTime(interaction, "✅ | **" + player.queue[0].title + "** sıranın önüne taşındı.");
        },
    },
};