module.exports = (client, data) => {
  //veri nedir? Discord Ağ Geçidi Verileri, Lütfen discord api belgelerini kontrol edin
  client.Manager.updateVoiceState(data);
};
