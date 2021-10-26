const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const levels = {
    yok: 0.0,
    düşük: 0.2,
    normal: 0.3,
    yüksek: 0.35,
};
module.exports = {
    name: "bass",
    description: "Bas artırma ses efektini etkinleştirir",
    usage: "<yok|düşük|normal|yüksek>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["bb", "bass", "bassboost"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {

        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **...**");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **You must be in the same voice channel as me to use this command!**");

        if (!args[0]) return client.sendTime(message.channel, "**Lütfen bir bas yükseltme seviyesi sağlayın. \nKullanılabilir Düzeyler:** `yok`, `düşük`, `normal`, `yüksek`"); //kullanıcı argüman sağlamıyorsa [argümanlar]

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return client.sendTime(message.channel, `✅ | **Bassboost \`${level}\` seviyesi olarak ayarlandı**`);
    },
    SlashCommand: {
        options: [
            {
                name: "bass",
                description: `Lütfen bir bas yükseltme seviyesi sağlayın. Mevcut Seviyeler: düşük, normal, yüksek veya yok`,
                value: "[seviye]",
                type: 3,
                required: true,
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
            const levels = {
                yok: 0.0,
                düşük: 0.2,
                normal: 0.3,
                yüksek: 0.35,
            };

            let player = await client.Manager.get(interaction.guild_id);
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            if (!player) return client.sendTime(interaction, "❌ | **Şu anda hiçbir şey çalmıyor...**");
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return client.sendTime(interaction, ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**");
            if (!args) return client.sendTime(interaction, "**Lütfen bir bas yükseltme seviyesi sağlayın. \nMevcut Seviyeler:** `yok`, `düşük`, `normal`, `yüksek`"); //if the user do not provide args [arguments]

            let level = "none";
            if (args.length && args[0].value in levels) level = args[0].value;

            player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

            return client.sendTime(interaction, `✅ | **Bassboost seviyesini şuna ayarlayın:** \`${level}\``);
        },
    },
};
