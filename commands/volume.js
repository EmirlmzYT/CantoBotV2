const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "ses",
    description: "Mevcut ses seviyesini kontrol edin veya değiştirin",
    usage: "<seviye>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v", "ses"],
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
        if (!args[0]) return client.sendTime(message.channel, `🔉 | Mevcut ses seviyesi \`${player.volume}\`.`);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bu komutu kullanmak için bir ses kanalında olmalısınız!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**");
        if (!parseInt(args[0])) return client.sendTime(message.channel, `**Lütfen arasında bir sayı seçin** \`1 - 100\``);
        let vol = parseInt(args[0]);
        if(vol < 0 || vol > 100){
          return  client.sendTime(message.channel, "❌ | **Lütfen arasında bir sayı seçin `1-100`**");
        }
        else{
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | **Ses düzeyi** \`${player.volume}\``);
        }
    },
    SlashCommand: {
        options: [
            {
                name: "miktar",
                value: "miktar",
                type: 4,
                required: false,
                description: "1-100 arasında bir ses seviyesi girin. Varsayılan 100'dür.",
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | Bu komutu kullanmak için bir ses kanalında olmalısınız.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Bu komutu kullanabilmek için benimle aynı ses kanalında olmalısınız!**");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Şu anda hiçbir şey çalmıyor...**");
            if (!args[0].value) return client.sendTime(interaction, `🔉 | Mevcut ses seviyesi \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `**Lütfen arasında bir sayı seçin** \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | Ses düzeyi \`${player.volume}\``);
        },
    },
};
