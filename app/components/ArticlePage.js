import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import ArticleCardList from '../controls/ArticleCardList'
import ArticlePost from '../controls/Articles/ArticlePost'
import {loadArticlesAsync,createBookmarkAsync,analyzeArticleAsync,searchForMyArticleAsync,changePage, loginJwt} from '../actions/actions'
import StoreObserver from '../services/StoreObserver'
import Auth from '../model/Auth'

class ArticlePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    if(props.userInfo === undefined){
      props.loginJwt(Auth.getJwt())
    }    
    this.settings = props.settings
    this.analyzeArticle = props.analyzeArticle
    this.searchForArticle = props.searchForArticle
    this.changePage = props.changePage
    this.history = props.history
	}
  
  selectState(superState){
    return { 
      articles:superState.articleList.articles, 
      identity: superState.identity, 
      bookmark:superState.articleList.bookmark,
      error: superState.failure.error
    };
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
      && subStateA.identity.userInfo.biasToken == subStateB.identity.userInfo.biasToken
      && subStateA.articles !== undefined
      && subStateB.articles !== undefined
      && subStateA.articles.equals(subStateB.articles)
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
        self.changePage("article", "", self.history)
      }
    }
    if(state.identity.userInfo !== undefined && state.articles.length == 0 && self.hasLoaded === undefined){
      self.props.loadArticles(self.settings, state.identity.userInfo);
      self.hasLoaded = true;  
    }

    if(state.articles.length > 0 && state.bookmark !== undefined){
      var url = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '')+ "/bookmark/" + state.bookmark.bookmarkId;
      FB.ui({
          method: 'share',
          href: url,
      }, function(response){});     
    }
  }

	render(){
    if(this.state.articles.length == 0){
      return (<div id="bookmark-page">
        <Menu active="articles" settings={this.settings} userInfo={this.state.identity.userInfo} pageSearch={this.searchForArticle}/>
        <br/> <br/>
        <ArticlePost settings={this.settings} userInfo={this.state.identity.userInfo} analyzeArticle={this.analyzeArticle}/>
      </div>
      );
    }else{
    return (
      <div id="bookmark-page">
        <Menu active="articles" settings={this.settings} userInfo={this.state.identity.userInfo} pageSearch={this.searchForArticle}/>
        <br/> <br/>
        <ArticlePost settings={this.settings} userInfo={this.state.identity.userInfo} analyzeArticle={this.analyzeArticle}/>
        <ArticleCardList articles={this.state.articles} settings={this.settings} userInfo={this.state.identity.userInfo}/>
      </div>
    );}
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadArticles:(settings, userInfo) => dispatch(loadArticlesAsync(settings, userInfo)),
    createBookmark: (settings, article, userInfo) => dispatch(createBookmarkAsync(settings, article, userInfo)),
    analyzeArticle: (label, link, settings, userInfo) => dispatch(analyzeArticleAsync(label, link, settings, userInfo)),
    searchForArticle: (keyword, settings, userInfo) => dispatch(searchForMyArticleAsync(keyword, settings, userInfo)),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticlePageUnwrapped))