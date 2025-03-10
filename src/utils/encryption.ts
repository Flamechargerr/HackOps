
export const caesarCipher = (text: string, shift: number): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
      }
      return char;
    })
    .join('');
};

export const base64Decode = (str: string): string => {
  try {
    return atob(str);
  } catch {
    return str;
  }
};

export const leetSpeakDecode = (text: string): string => {
  const leetMap: { [key: string]: string } = {
    '@': 'a',
    '3': 'e',
    '1': 'i',
    '0': 'o',
    '5': 's',
    '7': 't',
  };

  return text
    .split('')
    .map(char => leetMap[char] || char)
    .join('');
};
