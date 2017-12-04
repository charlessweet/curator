import React from 'react'
import ReactDOM from 'react-dom'
import LoginButton from '../controls/LoginButton'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {indicatePageWasLoaded, loginAsync, changePage} from '../actions/actions'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import Paper from 'material-ui/Paper'
import Login from '../controls/Login'
import AppBar from 'material-ui/AppBar'
import pageTypes from '../pageTypes'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import worldImg from '../images/world.png'
import communityImg from '../images/community.png'
import joinImg from '../images/join.png'

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
      <div>
        <link href="https://fonts.googleapis.com/css?family=Cairo" rel="stylesheet"/>
        <div>
          <AppBar showMenuIconButton={false} title="Curator" iconElementRight={<span>Socializing news analysis</span>} />
          <Login target={pageTypes.STREAM} />
          <br/><br/>
        </div>      
        <Card>
          <CardMedia overlay={<CardTitle title="Truth" subtitle="matters" />} >
            <img src={worldImg} alt="" />
          </CardMedia>
          <CardText>
                <p>And it isn't relative. By definition, truth is foundational. It's the thing that you build conversations, agreements, 
                and make business deals on top of.</p>
          </CardText>
        </Card>
        <Card>
          <CardMedia overlay={<CardTitle title="Community" subtitle="matters" />} >
            <img src={communityImg} alt="" />
          </CardMedia>
          <CardText>
                <p>Be part of the Curator community by becoming a Guardian. Curator Guardians are the keepers of truth. Analyze 
                articles for logical and factual errors, and tell the world.</p>
          </CardText>
        </Card>
        <Card>
          <CardMedia overlay={<CardTitle title="Join" subtitle="the solution" />} >
            <img src={joinImg} alt="" />
          </CardMedia>
          <CardText>
                <p>Sign up for a Curator account now, and become part of the solution.</p>
          </CardText>
          <CardActions>
            <center>
              <Link to="/create">Create an Account</Link>
            </center>
          </CardActions>
        </Card>
  		</div>
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