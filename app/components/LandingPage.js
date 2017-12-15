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

  const styles = {
    paperContainer: {
        height: 1356,
        backgroundImage: "url(" + CurationImg + ")",
        "backgroundRepeat":"no-repeat",
        "border":0,
        "backgroundColor":"white",
        "boxShadow":"none"
    }
  }

class LandingPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = props.userInfo
	}
  
    render() {
        return (
            <Paper style={styles.paperContainer} elevation={0}>
              <Button>Learn More</Button>
              <Button>Log In</Button>
              <Grid container>
                <Grid item xs={0} md={6}>&nbsp;</Grid>
                <Grid item md={6} xs={12}>
                  Put my verbiage here!
                </Grid>
              </Grid>
            </Paper>
        )
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPageUnwrapped))