export function generateSixDigitString(): string {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += digits[Math.floor(Math.random() * 10)];
    }
    return result;
  }
