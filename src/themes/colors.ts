const palette = {
  saffronFire: '#FF8C42',
  burntPaprika: '#E66A32',
  sandNougat: '#FFD9A0',
  deepMaroon: '#8C2F2B',
  brickRust: '#C24C30',
  carbon: '#2B2B2B',
  ember: '#1B120E',
} as const;

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r, g, b};
};

const withOpacity = (hex: string, alpha: number) => {
  const {r, g, b} = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const colors = {
  palette,
  background: palette.ember,
  surface: withOpacity(palette.sandNougat, 0.12),
  surfaceAlt: withOpacity(palette.deepMaroon, 0.35),
  glassBorder: withOpacity(palette.sandNougat, 0.42),
  text: '#FFF7EE',
  subText: withOpacity('#FFF7EE', 0.74),
  primary: palette.saffronFire,
  accent: palette.sandNougat,
  secondary: palette.burntPaprika,
  disabled: withOpacity('#FFF7EE', 0.35),
  placeholder: withOpacity(palette.sandNougat, 0.65),
  success: '#F7D078',
  warning: '#FFB347',
  error: palette.brickRust,
  overlay: withOpacity(palette.carbon, 0.88),
  softOverlay: withOpacity(palette.deepMaroon, 0.28),
  glassTint: withOpacity(palette.carbon, 0.62),
  badgePositiveBg: withOpacity(palette.sandNougat, 0.25),
  badgePositiveBorder: withOpacity(palette.sandNougat, 0.55),
  badgeNegativeBg: withOpacity(palette.brickRust, 0.23),
  badgeNegativeBorder: withOpacity(palette.brickRust, 0.55),
};
