// helper/colorCache.ts
import { generateContrastingColors } from "./colorGenerator";

// Храним цвета по sender_id
const colorCache = new Map<number, { background: string; text: string }>();

export const getUserColor = (senderId: number) => {
  if (!colorCache.has(senderId)) {
    const color = generateContrastingColors();
    colorCache.set(senderId, color);
  }
  return colorCache.get(senderId)!;
};

// Если хотите сбросить кэш (например, при выходе)
export const clearUserColorCache = () => {
  colorCache.clear();
};