/**
 * Create a text progress bar
 * @param {Number} value - The value to fill the bar
 * @param {Number} maxValue - The max value of the bar
 * @param {Number} size - The bar size (in letters)
 * @return {{Bar: string, percentageText: string}} - The bar
 */
module.exports = (value, maxValue, size) => {
  const percentage = value / maxValue; // Çubuğun yüzdesini hesaplayın
  const progress = Math.round(size * percentage); // İlerleme tarafını doldurmak için kare karakter sayısını hesaplayın.
  const emptyProgress = size - progress; // Boş ilerleme tarafını doldurmak için tire karakterlerinin sayısını hesaplayın.

  const progressText = "▇".repeat(progress); // Tekrarla, içinde ilerleme * karakterleri olan bir dize oluşturuyor
  const emptyProgressText = "—".repeat(emptyProgress); // Tekrarlama, içinde boş ilerleme * karakterleri olan bir dize oluşturuyor
  const percentageText = Math.round(percentage * 100) + ""; // Çubuğun yüzdesini görüntüleme

  const Bar = progressText + emptyProgressText; // çubuğu oluşturmak
  return { Bar, percentageText };
};
