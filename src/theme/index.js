import { white, black, blue, pink, yellow, green, grey, red, boxShadow} from './colors'

const theme = {
  borderRadius: 2,
  breakpoints: {
    mobile: 400,
  },
  color: {
    primary: {
      100: "#eefef7",
      300: "#00a490",
      500: "#019d8b",
      900: "#007c6e",
    },
    secondary: {
      100: "#019d8b",
      500: "#007c6e",
	  700: "#025e5a",
      900: "#044D44",
    },
    textPrimary: grey[100],
    textSecondary: white,
    bgPrimary: grey[200],
    bgSecondary: grey[100],
    bgWhite: white,
    white,
    black,
    grey,
    blue,
    pink,
    yellow,
    green,
    red,
    boxShadow,
  },
  siteWidth: 1200,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
}

export default theme