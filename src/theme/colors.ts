import { MD3DarkTheme } from "react-native-paper";

const colors = {
  primary: "#E50914",  
  background: "#121212",
  surface: "#1c1c1c",
  text: "#FFFFFF",
  subtitle: "#cfcfcf",
  border: "rgba(255,255,255,0.1)",
};

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...colors,
  },
};

export { colors };
export default theme;
