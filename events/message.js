/**
 *
 * @param {require("../structures/DiscordMusicBot")} client
 * @param {require("discord.js").Message} message
 * @returns {void} aka: nothing ;-;
 */

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  let prefix = client.botconfig.DefaultPrefix;

  let GuildDB = await client.GetGuild(message.guild.id);
  if (GuildDB && GuildDB.prefix) prefix = GuildDB.prefix;

  //Initialize GuildDB
  if (!GuildDB) {
    await client.database.guild.set(message.guild.id, {
      prefix: prefix,
      DJ: null,
    });
    GuildDB = await client.GetGuild(message.guild.id);
  }

  //Ön ekler ayrıca söz eşleşmesine sahiptir
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : prefix;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  //Dosya adımız küçük harf olacağı için altCase komutunu yapmak
  const command = args.shift().toLowerCase();

  //Komut arama
  const cmd =
    client.commands.get(command) ||
    client.commands.find((x) => x.aliases && x.aliases.includes(command));

  //Komutu veya takma adları aldığımızda kodları yürütmek
  if (cmd) {
    if (
      (cmd.permissions &&
        cmd.permissions.channel &&
        !message.channel
          .permissionsFor(client.user)
          .has(cmd.permissions.channel)) ||
      (cmd.permissions &&
        cmd.permissions.member &&
        !message.channel
          .permissionsFor(message.member)
          .has(cmd.permissions.member)) ||
      (cmd.permissions &&
        GuildDB.DJ &&
        !message.channel
          .permissionsFor(message.member)
          .has(["ADMINISTRATOR"]) &&
        !message.member.roles.cache.has(GuildDB.DJ))
    )
      return client.sendError(
        message.channel,
        "Eksik İzinler!" + GuildDB.DJ
          ? " Bu komuta erişmek için 'DJ' rolüne ihtiyacınız var."
          : ""
      );
    cmd.run(client, message, args, { GuildDB });
    client.CommandsRan++;
  } else return;
};
