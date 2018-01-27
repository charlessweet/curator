import React from 'react'
import ReactDOM from 'react-dom'
import RequestPasswordReset from '../controls/RequestPasswordReset'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {indicatePageWasLoaded, loginAsync, changePage} from '../actions/actions'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import Paper from 'material-ui/Paper'
import Login from '../controls/Login'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import pageTypes from '../pageTypes'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'

class RequestPasswordResetPageUnwrapped extends React.Component{
  constructor(props){
    super(props);
    this.login = props.login;
    this.history = props.history;
    props.showLogin();
    this.goToPage = props.goToPage;

    this.style = {
      height: 500,
      width: 300,
      margin: 10,
      padding: 10,
      display: 'inline-block',

    };
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
      && subStateA.identity.biasToken == subStateB.identity.biasToken;
    return evaluated
  }

  componentWillMount(){
    this.setState(this.selectState(store.getState()));
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.navigate, this.compareState);
  }

  componentWillUnmount(){
    this.observer.unsubscribe();
  }
  
  selectState(superState){
    return {"settings":superState.settings, "page":superState.page, identity: superState.identity.userInfo};
  }
  
  navigate(self, state){
    if(state.identity !== undefined){
      self.goToPage("stream", self.history)

      if(self.observer !== undefined)
        self.observer.unsubscribe();
    }
  }

  render(){
    let titleStyle = {
      "fontFamily":"'Cairo', sans serif",
      "fontSize" : "2em",
      "fontWeight" : "bolder"
    }

    let subTitleStyle = {
      "fontSize" : "0.9em",
      "paddingTop" : "1.3em",
      "display" : "block"
    }

    let barStyle = {
      "backgroundColor": "#3F51B5",
      "color": "white"
    }
    return (
      <Grid container>
        <link href="https://fonts.googleapis.com/css?family=Cairo" rel="stylesheet"/>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <Typography type="title" style={{"color":"#FFFFFF","fontFamily" : "'IM Fell English', serif","fontSize":"2em"}}>
                Curator
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>  
        <Grid item xs={12} md={6}>
          <RequestPasswordReset />
        </Grid>
      </Grid>      
    );
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let currentPage = "login";
  return {
    login:(settings,facebookData, history) => {
      dispatch(loginAsync(settings, facebookData, history));
    },
    showLogin: () => {
      dispatch(indicatePageWasLoaded(currentPage));
    },
    goToPage: (targetPage, history) => {
      dispatch(changePage(currentPage, targetPage, history));
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RequestPasswordResetPageUnwrapped))
