export type ThemeScale = 'light' | 'dark';

export const createThemeToken = (scale: ThemeScale = 'light'): string => {
  return scale === 'dark' ? 'ttb-dark' : 'ttb-light';
};
