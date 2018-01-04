import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import CurationImg from '../images/curation.png'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import {changePage} from '../actions/actions'

const styles = {
  paperContainer: {
      height: 1356,
      width: "100%",
      backgroundImage: "url(" + CurationImg + ")",
      "backgroundRepeat":"no-repeat",
      "border":0,
      "backgroundColor":"white",
      "boxShadow":"none",
      "margin":"5em"
  }
}

class LandingPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.goToPage = (page) => { props.goToPage(page, props.history) }
	}
  
  render() {
        return (
          <Grid container>
            <Grid item xs={12}>
              <Paper style={styles.paperContainer} elevation={0}>
                <Typography type="headline" component="h2">Socializing News Analysis</Typography>
                <Button onClick={()=>{this.goToPage('login')}}>Log In</Button>
                <Button onClick={()=>{this.goToPage('create')}}>Get Started</Button>
              </Paper>
            </Grid>
          </Grid>
        )
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let currentPage = "landing"
  return {
    goToPage: (targetPage, history) => {
      dispatch(changePage(currentPage, targetPage, history));
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPageUnwrapped))