import React from 'react';
import ReactDOM from 'react-dom';
import LoginButton from '../controls/LoginButton'
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {indicatePageWasLoaded, loginAsync, changePage} from '../actions/actions'
import store from '../store'
import StoreObserver from '../services/StoreObserver'

class LoginUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.login = props.login;
    this.history = props.history;
    props.showLogin();
    this.goToPage = props.goToPage;
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
			 <div className="frontpage">
  			 <div id="index-banner" className="parallax-container frontpage">
    				<div className="section no-pad-bot">
      				 <div className="container">
        				 <br/>
        					 <br/>
        					 <h1 className="header center indigo-text text-darken-4 frontpage">Curator</h1>
        					 <div className="row center frontpage">
          						  <h5 className="header col s12 light indigo-text text-darken-4">Socializing news analysis.</h5>
          						  <p id="accounts-available"></p>
                					 <LoginButton login={this.login} successAction={() => { this.goToPage("stream") }} settings={this.state}/>
        					 </div>
      					 </div>
    				  </div>
    				  <div className="parallax"><img src={require('../images/background1.jpg')} alt="Unsplashed background img 1"></img></div>
    			</div>
          <div className="container">
            <div className="section">
              <div className="row">
                <div className="col s12 m4">
                  <div className="icon-block">
                    <h2 className="center indigo-text"><i className="material-icons">flash_on</i></h2>
                    <h5 className="center">Truth in a post-truth world.</h5>
                      <p className="light">
              Even on the internet, reputation matters.  If you edit an article in Wikipedia, arguably the most relevant source of information
              on the planet, there are multiple layers of protections in 
              place for users to police themselves and others, all driven by reputation.  In a post-truth world, people still care about reputation, perhaps
              even more so than before.
              Bias Checker began as a site for checking articles for bias, but has evolved into a reputation system for individuals who, like you, act as
              reporters in disclosing information to others to consume.
                      </p>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="icon-block">
                    <h2 className="center indigo-text"><i className="material-icons">group</i></h2>
                    <h5 className="center">Of the people, by the people.</h5>
                      <p className="light">
              Algorithms are capable of achieving some exception results real-time.  The nuance of interpersonal communication
              and isn't something that computers are particularly good at. Wikipedia has shown us that when we all work as stewards
              of facts, we can produce some amazingly accurate results. Curator applies the concept of socializing authority to 
              the near real-time analysis of news.  Any one person can't possibly keep up in a post-truth landscape, but all of us
              might have a chance!
                      </p>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="icon-block">
                    <h2 className="center indigo-text"><i className="material-icons">settings</i></h2>
                    <h5 className="center">How do you use it?</h5>
                      <p className="light">
            Join Facebook. Then create a Curator account. Curator uses Facebook as the source of articles.  When you join, Curator will immediately start pulling
            in data you post to your facebook feed. This data is added to the 'stream'.  Guardians (and you can be a Guardian for anyone's 
            articles but your own) will then analyze different aspects of the article you shared (context, logic, truthfulness), and give you feedback on what that score is.  That 
            feedback will be shared anonymously with all other users of the community.  Curious about an article? You can also bypass Facebook
            and post your article directly within Curator.
                      </p>
                  </div>
                </div>                
              </div>
            </div>
          </div>
				  <div className="parallax-container valign-wrapper frontpage">
    				  <div className="section no-pad-bot">
                <div className="parallax">
                  <img src={require('../images/background2.jpg')} alt="Unsplashed background img 2"></img>
                </div>                 
    				  </div>
				  </div>
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