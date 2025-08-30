import { MD3DarkTheme } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E50914', // Netflix red look
    background: '#121212',
    surface: '#1c1c1c',
    text: '#FFFFFF',
    accent: '#E50914',
  },
};

export default theme;
