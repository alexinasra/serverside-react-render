const { createMuiTheme } = require('@material-ui/core/styles');
const red = require('@material-ui/core/colors/red').default;
const orange = require('@material-ui/core/colors/orange').default;
const lightBlue = require('@material-ui/core/colors/lightBlue').default;

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: lightBlue,
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

module.exports = theme;
