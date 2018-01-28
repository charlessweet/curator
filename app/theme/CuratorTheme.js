import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';
import { createMuiTheme } from 'material-ui/styles'
import primaryColor from 'material-ui/colors/blueGrey'
import secondaryColor from 'material-ui/colors/pink'
import errorColor from 'material-ui/colors/red'

const getContrastText = (color)=>{
  return secondaryColor[200]
}

export default createMuiTheme({
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    error: errorColor,
  }
})