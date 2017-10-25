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
        <div>
          <center>
            <h1 className="header center indigo-text text-darken-4 frontpage">Curator</h1>
            <h5 className="header col s12 light indigo-text text-darken-4">Socializing news analysis.</h5>
            <LoginButton login={this.login} successAction={() => { this.goToPage("stream") }} settings={this.state}/>
          </center>
        </div>      
        <br/>
        <br/>    
        <Paper style={this.style} zDepth={0}>
            <h2 className="center indigo-text"><i className="material-icons">flash_on</i></h2>
            <h5 className="center">Truth in a post-truth world.</h5>
            <p className="light">
              Even on the internet, reputation matters.<br/><br/>If you edit an article in Wikipedia, the most relevant source of encyclopedic knowledge
              on the planet, there are multiple layers of protections in place for users to police themselves and others, all driven by reputation.  In a post-truth world, people still care about reputation, perhaps
              even more so than before.<br/><br/>Bias Checker began as a site for checking articles for bias, but has evolved into a reputation system for individuals who, like you, act as
              reporters in disclosing information to others to consume.
            </p>          
        </Paper>
        <Paper style={this.style} zDepth={2}>
            <h2 className="center indigo-text"><i className="material-icons">group</i></h2>
            <h5 className="center">Of the people, by the people...</h5>
            <p className="light">
              Algorithms are awesome. There are many, many things that algorithms are good at. Determining intent isn't one of them.<br/><br/><br/>
              Algorithms can't tell you if an article is true - or not. Algorithms can't detect bias tucked away in quotes, within quotes. Algorithms
              can't determine what's missing from a quote taken out of context.<br/><br/>Curator leverages people to do what people are good at, and algorithms to do what 
              algorithms are good at.
            </p>            
        </Paper>
        <Paper style={this.style} zDepth={0}>
            <h2 className="center indigo-text"><i className="material-icons">settings</i></h2>
            <h5 className="center">How do you use it?</h5>
            <p className="light">
              Create a Curator account. Curator uses Facebook as the source of articles. When you join, Curator will immediately start pulling
              in data you post to your facebook feed. This data is added to the 'stream'.  Guardians (and you can be a Guardian for anyone's 
              articles but your own) will then analyze different aspects of the article you shared (context, logic, truthfulness), and give you feedback on what that score is.  That 
              feedback will be shared anonymously with all other users of the community.  Curious about an article? You can also bypass Facebook
              and post your article directly within Curator.
            </p>        
        </Paper>
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