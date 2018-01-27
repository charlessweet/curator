import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import ArticleCardList from '../controls/ArticleCardList'
import ArticlePost from '../controls/Articles/ArticlePost'
import {loadArticlesAsync,analyzeArticleAsync,searchForMyArticleAsync,changePage, clearError} from '../actions/actions'
import StoreObserver from '../services/StoreObserver'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import Grid from 'material-ui/Grid'

class ArticlePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.settings = props.settings
    this.analyzeArticle = props.analyzeArticle
    this.searchForArticle = props.searchForArticle
    this.changePage = props.changePage
    this.history = props.history
    this.clearError = props.clearError
    this.hasLoaded = false
	}
  
  selectState(superState){
    return { 
      articles:superState.articleList.articles,
      bookmark:superState.articleList.bookmark,
      error: superState.failure.error
    };
  }

  areEqual(subStateA, subStateB){
    let evaluated = subStateA.articles === subStateB.articles
      && subStateA.error === subStateB.error
      && subStateA.bookmark === subStateB.bookmark
      return evaluated
  }

  componentWillMount(){
    let localState = this.selectState(store.getState())
    this.loadComponent(this, localState)    
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.areEqual)
  }

  componentWillUnmount(){
    if(this.observer !== undefined){
      this.observer.unsubscribe();
    }
  }

  loadComponent(self, state){
    self.setState(state);
    if(state.error !== undefined){
      if(state.error.httpCode === 401){
        self.clearError()
        self.changePage("article", "", self.history)
      }
    }
    if(state.articles.length == 0 && self.hasLoaded === false){
      self.props.loadArticles(self.settings);
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
    return (
      <Grid container>
          <Grid item xs={12} md={12}  style={{"padding":"0px"}}>
            <Menu active="articles" settings={this.settings} userInfo={this.userInfo} pageSearch={this.searchForArticle}/>
            <ArticlePost settings={this.settings} userInfo={this.userInfo} analyzeArticle={this.analyzeArticle}/>
          </Grid>
          <Grid item xs={12}>
          {
            this.state.articles.length == 0 && !this.hasLoaded
            ? <div className="container"><div className="progress"><div className="indeterminate"></div></div></div>
            : <ArticleCardList articles={this.state.articles} settings={this.settings} userInfo={this.userInfo} />
          }
          </Grid>
        </Grid>
    );
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadArticles:(settings) => dispatch(loadArticlesAsync(settings)),
    analyzeArticle: (label, link) => dispatch(analyzeArticleAsync(label, link)),
    searchForArticle: (keyword, settings, userInfo) => dispatch(searchForMyArticleAsync(keyword, settings, userInfo)),
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history)),
    clearError: () => dispatch(clearError())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticlePageUnwrapped))