import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import ArticleCardList from '../controls/ArticleCardList'
import ArticlePost from '../controls/Articles/ArticlePost'
import {loadArticlesAsync,createBookmarkAsync,analyzeArticleAsync,searchForMyArticleAsync} from '../actions/index'
import StoreObserver from '../services/StoreObserver'

class ArticlePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.analyzeArticle = props.analyzeArticle
    this.searchForArticle = props.searchForArticle
	}
  
  selectState(superState){
    return { articles:superState.articleList.articles, identity: superState.identity, bookmark:superState.articleList.bookmark };
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
    this.setState(this.selectState(store.getState()));
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.compareState)
  }

  componentWillUnmount(){
    this.observer.unsubscribe();
  }

  loadComponent(self, state){
    self.setState(state);
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
    searchForArticle: (keyword, settings, userInfo) => dispatch(searchForMyArticleAsync(keyword, settings, userInfo))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticlePageUnwrapped))