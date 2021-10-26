module.exports = {
  Admins: ["611846254040842255", "853015277482410014"], //Admins of the bot
  ExpressServer: true,//If you wanted to make the website run or not
  DefaultPrefix: process.env.Prefix || ".", //Default prefix, Server Admins can change the prefix
  Port: 3000, //Which port website gonna be hosted
  SupportServer: "https://discord.gg/77wvvV2Fk5", //Support Server Link
  Token: process.env.Token || "", //Discord Bot Token
  ClientID: process.env.Discord_ClientID || "", //Discord Client ID
  ClientSecret: process.env.Discord_ClientSecret || "", //Discord Client Secret
  Scopes: ["identify", "guilds", "applications.commands"],//Discord OAuth2 Scopes
  ServerDeafen : true,//If you want bot to stay deafened
  CallbackURL: "/api/callback", //Discord OAuth2 Callback URL
  "24/7": false, //If you want the bot to be stay in the vc 24/7
  CookieSecret: "canto seni siker", //A Secret like a password
  IconURL:
    "https://cdn.discordapp.com/attachments/885265710119526400/900675960024739860/CantoV2.jpg", //URL of all embed author icons | Dont edit unless you dont need that Music CD Spining
  EmbedColor: "red", //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
  Website: process.env.Website || "", //Website where it was hosted at includes http or https || Use "0.0.0.0" if you using Heroku

  //Lavalink
  Lavalink: {
    id: process.env.id || "",
    host: process.env.host || "",
    port: 443, // The port that lavalink is listening to. This must be a number!
    pass: process.env.pass || "", 
    secure: true, // Set this to true if the lavalink uses SSL or you're hosting lavalink on repl.it
  },


  //Please go to https://developer.spotify.com/dashboard/
  Spotify: {
    ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
    ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
  },
};
