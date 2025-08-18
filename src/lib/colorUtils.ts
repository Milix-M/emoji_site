export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const hexToRgba = (hex: string): Rgba => {
  hex = hex.startsWith('#') ? hex.slice(1) : hex;
  const isShort = hex.length === 3 || hex.length === 4;

  const r = parseInt(isShort ? hex[0] + hex[0] : hex.substring(0, 2), 16);
  const g = parseInt(isShort ? hex[1] + hex[1] : hex.substring(2, 4), 16);
  const b = parseInt(isShort ? hex[2] + hex[2] : hex.substring(4, 6), 16);
  let a = 255;
  if (hex.length === 4 || hex.length === 8) {
    a = parseInt(isShort ? hex[3] + hex[3] : hex.substring(6, 8), 16);
  }

  return { r, g, b, a: a / 255 };
};

export const rgbaToHex = (rgba: Rgba): string => {
  const toHex = (c: number) => `0${Math.round(c).toString(16)}`.slice(-2);
  const r = toHex(rgba.r);
  const g = toHex(rgba.g);
  const b = toHex(rgba.b);
  const a = toHex(rgba.a * 255);
  return `#${r}${g}${b}${a}`;
};
