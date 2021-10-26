const { DiscordMusicBot } = require('../structures/DiscordMusicBot');
const { VoiceState, MessageEmbed} = require("discord.js");
/**
 *
 * @param {DiscordMusicBot} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @returns {Promise<void>}
 */
module.exports = async (client, oldState, newState) => {

    // lonca ve oyuncu al
    let guildId = newState.guild.id;
    const player = client.Manager.get(guildId);

    // botun aktif olup olmadığını kontrol edin (oynanıyor, duraklatılıyor veya boş önemli değil (aksi halde geri dönün)
    if (!player || player.state !== "CONNECTED") return;

    // prepreoces the data
    const stateChange = {};
    // get the state change
    if (oldState.channel === null && newState.channel !== null) stateChange.type = "JOIN";
    if (oldState.channel !== null && newState.channel === null) stateChange.type = "LEAVE";
    if (oldState.channel !== null && newState.channel !== null) stateChange.type = "MOVE";
    if (oldState.channel === null && newState.channel === null) return; // you never know, right
    if (newState.serverMute == true && oldState.serverMute == false) return player.pause(true);
    if (newState.serverMute == false && oldState.serverMute == true) return player.pause(false);
    // move check first as it changes type  
    if (stateChange.type === "MOVE") {
        if (oldState.channel.id === player.voiceChannel) stateChange.type = "LEAVE";
        if (newState.channel.id === player.voiceChannel) stateChange.type = "JOIN";
    }
    // double triggered on purpose for MOVE events
    if (stateChange.type === "JOIN") stateChange.channel = newState.channel;
    if (stateChange.type === "LEAVE") stateChange.channel = oldState.channel;

    // check if the bot's voice channel is involved (return otherwise)
    if (!stateChange.channel || stateChange.channel.id !== player.voiceChannel) return;

    // mevcut kullanıcıları bot olmaya göre filtrele
    stateChange.members = stateChange.channel.members.filter(member => !member.user.bot);

    switch (stateChange.type) {
        case "JOIN":
            if (stateChange.members.size === 1 && player.paused) {
                let emb = new MessageEmbed()
                    .setAuthor(`Duraklatılmış sıraya devam ediliyor`, client.botconfig.IconURL)
                    .setColor(client.botconfig.EmbedColor)
                    .setDescription(`Hepiniz beni tek başıma çalmam için müzikle bıraktığınız için oynatmaya devam ediyorum`);
                await client.channels.cache.get(player.textChannel).send(emb);

                // şimdi çalan mesajı güncelleyin ve öne getirin
                let msg2 = await client.channels.cache.get(player.textChannel).send(player.nowPlayingMessage.embeds[0])
                player.setNowplayingMessage(msg2);

                player.pause(false);
            }
            break;
        case "LEAVE":
            if (stateChange.members.size === 0 && !player.paused && player.playing) {
                player.pause(true);

                let emb = new MessageEmbed()
                    .setAuthor(`Duraklatıldı!`, client.botconfig.IconURL)
                    .setColor(client.botconfig.EmbedColor)
                    .setDescription(`Liste duraklatıldı çünkü herkes ayrıldı`);
                await client.channels.cache.get(player.textChannel).send(emb);
            }
            break;
    }
}
