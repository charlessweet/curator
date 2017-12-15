import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from '../controls/LoginButton'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {indicatePageWasLoaded, loginAsync, changePage} from '../actions/actions'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import Login from '../controls/Login'
import AppBar from 'material-ui/AppBar'
import pageTypes from '../pageTypes'
import Card, {CardActions, CardHeader, CardMedia, CardContent} from 'material-ui/Card';
import worldImg from '../images/world.png'
import communityImg from '../images/community.png'
import joinImg from '../images/join.png'
import appLogo from '../images/app-logo.png'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar'
import Divider from 'material-ui/Divider'
import Grid from 'material-ui/Grid';

class LoginUnwrapped extends React.Component{
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
    return (
      <Grid container>
        <link href="https://fonts.googleapis.com/css?family=Cairo" rel="stylesheet"/>
        <Grid item xs={12}>
          <AppBar position="static">
            <Toolbar>
              <Typography type="title" style={{"color":"#FFFFFF"}}>
                Curator
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>  
        <Grid item xs={12} md={3}>
          <Card style={{"margin":5}}>
            <CardContent>
              <Login target={pageTypes.STREAM} />
              <br/>
              <Divider/>
              <center><Link to="/create">Create an Account</Link></center>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{"margin":5}}>
            <CardMedia title="Truth" image={worldImg} style={{"width":"100%", "height":100}}/>
            <CardContent>
              <Typography type="headline" component="h2">
                Truth matters.
              </Typography>
              <Typography component="p">
                And it isn't relative. By definition, truth is foundational. It's the thing that you build conversations, agreements, 
                and make business deals on top of.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{"margin":5}}>
            <CardMedia title="Community" image={communityImg} style={{"width":"100%", "height":150}}/>
            <CardContent>
              <Typography type="headline" component="h2">
                Community matters.
              </Typography>
              <Typography component="p">
                Become part of the Curator community by becoming a Guardian. Curator Guardians are the keepers of truth. Analyze 
                articles for logical and factual errors, and tell the world.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card style={{"margin":5}}>
            <CardMedia title="Join" image={joinImg} style={{"width":"100%", "height":200}}/>
            <CardContent>
              <Typography type="headline" component="h2">
                Challenge accepted.
              </Typography>
              <Typography component="p">
                Whether owning the Truth by being a gardian, or contributing content as a member, become part of the solution to 
                sloppy or inaccurate news.
              </Typography>
              <Link to="/create">Join Today!</Link>
            </CardContent>
          </Card>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginUnwrapped))