// colorGenerator.ts

export const generateContrastingColors = () => {
    // Базовые цвета (HUE — оттенок в HSL)
    const baseHues = {
      red: 0,
      orange: 30,
      yellow: 60,
      green: 120,
      teal: 180,
      blue: 240,
      purple: 270,
      pink: 300,
    };

    // Случайный оттенок из базовых
    const hues = Object.values(baseHues);
    const hue = hues[Math.floor(Math.random() * hues.length)];

    // Случайный фон: насыщенный, но не слишком тёмный
    const backgroundLightness = Math.random() * 30 + 45; // от 45% до 75% — хорошая видимость
    const backgroundSaturation = Math.random() * 30 + 70; // насыщенный

    const bgColor = hslToHex(hue, backgroundSaturation, backgroundLightness);

    // Подбираем цвет текста: белый или тёмный, в зависимости от фона
    const isDarkBackground = backgroundLightness < 60;
    const textColor = isDarkBackground ? "#ffffff" : "#000000";

    return {
      background: bgColor,
      text: textColor,
      // Для демонстрации
      isDarkBackground,
    };
  };

  // Вспомогательная функция: HSL → HEX
  function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }