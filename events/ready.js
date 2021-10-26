module.exports = async (client) => {
  client.Ready = true, 
  client.user.setPresence({
    status: "idle",  // Durumu Gösterebilirsin online (çevrimiçi), idle (boşta), and dnd(rahatsız etmeyin)
    activity: {
        name: "By Emirlmz | .help",// gösterilen mesaj
        type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING,
    }
});
    client.Manager.init(client.user.id);
    client.log("Başarıyla Giriş Yapıldı " + client.user.tag); // İsterseniz metni değiştirebilirsiniz, ancak "client.user.tag"i KALDIRMAYIN.
client.RegisterSlashCommands();
};

