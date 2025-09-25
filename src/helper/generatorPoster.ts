export function generatePoster({
    text,
    width = 1800,
    height = 900,
    bgColor1 = "#678098",
    bgColor2 = "#c1d0df",
    textColor = "#fff",
    fontSize = 65,
  }: {
    text: string;
    width?: number;
    height?: number;
    bgColor1?: string;
    bgColor2?: string;
    textColor?: string;
    fontSize?: number;
  }) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // ==== Градиентный фон ====
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // ==== Рандомные круги ====
    for (let i = 0; i < 10; i++) {
      const radius = Math.random() * 100 + 20;
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
      ctx.fill();
    }

    // ==== Тень под текст ====
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 50;

    // ==== Текст ====
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // если текст длинный → перенос на 2 строки
    const maxWidth = width * 0.8;
    const words = text?.split(" ");
    let line = "";
    const lines: string[] = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    lines.forEach((l, i) => {
      ctx.fillText(l.trim(), width / 2, height / 2 + i * (fontSize + 10) - (lines.length - 1) * (fontSize / 2));
    });

    return canvas.toDataURL("image/png");
  }
