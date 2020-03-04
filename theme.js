import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#DB3127"
    },
    secondary: {
      main: "#3580C2"
    }
  },
  typography: {
    useNextVariants: true
  }
});

export default theme;
