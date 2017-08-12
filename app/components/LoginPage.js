import React from 'react';
import ReactDOM from 'react-dom';
import LoginButton from '../controls/LoginButton'
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {indicatePageWasLoaded, loginAsync, changePage} from '../actions/index'
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
        					 <h1 className="header center indigo-text text-darken-4 frontpage">Bias Checker</h1>
        					 <div className="row center frontpage">
          						  <h5 className="header col s12 light indigo-text text-darken-4">Social network for newsies.</h5>
          						  <p id="accounts-available"></p>
                					 <LoginButton login={this.login} successAction={() => { this.goToPage("registration") }} settings={this.state}/>
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
                    <h5 className="center">How it works...</h5>
                      <p className="light">
            In Bias Checker, we use a very simple metric.  It's proven to yield some quite interesting results.  We take the proportion
            of biased words used in an article, to total length of the article.  Once we have that proportion, we bucket the results into
            the range 1-10, 1 meaning "little or no bias", and 10 meaning "practically oozing bias".
                      </p>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="icon-block">
                    <h2 className="center indigo-text"><i className="material-icons">settings</i></h2>
                    <h5 className="center">How do you use it?</h5>
                      <p className="light">
            Use it however you like.  I like to add bias scores as comments on posts automatically or 
            just check out how my favorite sites are stacking up to each other.  The more you use it, the
            better it gets, so by all means, go bananas!<br/>Yes, bananas.<br/>With a monkey background...
                      </p>
                  </div>
                </div>                
              </div>
            </div>
          </div>
				  <div className="parallax-container valign-wrapper frontpage">
    				  <div className="section no-pad-bot">
      					 <div className="container">
        					 <div className="row center">
          						  <h5 className="header col s12 indigo-text light">News is important, but knowing how biased your source is can tell you more.</h5>
        					 </div>
      					 </div>
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