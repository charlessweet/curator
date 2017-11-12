import React from 'react';
import ReactDOM from 'react-dom';
import StreamInfo from '../controls/StreamInfo'
import StoreObserver from '../services/StoreObserver'
import store from '../store'
import Menu from '../controls/Menu'
import ArticleCardList from '../controls/ArticleCardList'
import ArticlePost from '../controls/Articles/ArticlePost'
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {loadStreamAsync, reviewArticle, loginJwt, changePage} from '../actions/actions'
import Auth from '../model/Auth'

class StreamPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    if(props.userInfo === undefined){
      props.loginJwt(Auth.getJwt())
    }
    this.settings = props.settings
    this.userInfo = props.userInfo
    this.reviewArticle = props.reviewArticle
    this.changePage = props.changePage
    this.history = props.history    
	}
  
  selectState(superState){
    return { 
      articles:superState.articleList.stream, 
      identity: superState.identity, 
      bookmark:superState.articleList.bookmark,
      error: superState.failure.error
    }
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
      && subStateA.identity.userInfo.biasToken == subStateB.identity.userInfo.biasToken
      && subStateA.articles !== undefined
      && subStateB.articles !== undefined
      && subStateA.articles.equals(subStateB.articles)

    let b = subStateA.articles.equals(subStateB.articles)
    return evaluated
  }

  componentWillMount(){
    let localState = this.selectState(store.getState())
    this.loadComponent(this, localState)
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.compareState)
  }

  componentWillUnmount(){
    this.observer.unsubscribe();
  }

  loadComponent(self, state){
    self.setState(state);
    if(state.error !== undefined){
      if(state.error.httpCode === 401){
        self.changePage("stream", "", self.history)
      }
    }    
    if(state.identity.userInfo !== undefined && state.articles.articles.length == 0 && self.hasLoaded === undefined){
      self.props.loadStream(self.settings, state.identity.userInfo);
      self.hasLoaded = true;  
    }

    if(state.articles.length > 0 && state.articles.bookmark !== undefined){
      var url = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '')+ "/bookmark/" + state.bookmark.bookmarkId;
      FB.ui({
          method: 'share',
          href: url,
      }, function(response){});     
    }
  }

	render(){
//      console.log("articles", this.state.articles.articles[0])
      return (<div id="bookmark-page">
        <Menu active="stream" settings={this.settings} userInfo={this.state.identity.userInfo} pageSearch={this.searchForArticle}/>
        <br/> <br/>
        <StreamInfo userInfo={this.state.identity.userInfo}/>
        {
          this.state.articles.length == 0
          ? <div className="container"><div className="progress"><div className="indeterminate"></div></div></div>
          : <ArticleCardList articles={this.state.articles} settings={this.settings} userInfo={this.state.identity.userInfo} reviewArticle={this.reviewArticle}/>
        }
        </div>
      );
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadStream:(settings, userInfo) => dispatch(loadStreamAsync(settings, userInfo)),
    reviewArticle: (article, history) => dispatch(reviewArticle(article, history)),
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history)),
    loginJwt: (jwt) => dispatch(loginJwt(jwt))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo: state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamPageUnwrapped))