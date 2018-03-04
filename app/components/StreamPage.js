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
import {loadStreamAsync, reviewArticleAsync, changePage, clearError} from '../actions/actions'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import Grid from 'material-ui/Grid';

class StreamPageUnwrapped extends React.Component{
  constructor(props){
    super(props);
    this.settings = props.settings
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.reviewArticle = props.reviewArticle
    this.changePage = props.changePage
    this.history = props.history 
    this.clearError = props.clearError 
    this.offset = 0
    this.count = 40
    this.loadStream = props.loadStream
  }
  
  selectState(superState){
    return { 
      articles:superState.articleList.stream, 
      bookmark:superState.articleList.bookmark,
      error: superState.failure.error
    }
  }

  areEqual(subStateA, subStateB){
    let evaluated = subStateA.articles === subStateB.articles
      && subStateA.error === subStateB.error
      
    return evaluated
  }

  componentWillMount(){
    let localState = this.selectState(store.getState())
    this.loadComponent(this, localState)
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.areEqual)
    window.addEventListener("scroll", ()=>{this.handleScroll(this)}) 
  }

  handleScroll(self) {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    //load more when 
    if(self.loading !== undefined && self.loading){
        if ((windowBottom + (0.1 * docHeight) < docHeight)){
            self.loading = false
        }
    }
    if ((windowBottom + (0.1 * docHeight) >= docHeight) && (self.loading === undefined || !self.loading)){
      self.loading = true
      self.offset += self.count
      self.hasLoaded = undefined
      self.loadStream(self.count, self.offset)
    }
  }

  componentWillUnmount(){
    this.observer.unsubscribe();
    window.removeEventListener("scroll", ()=>{this.handleScroll(this)})
  }

  loadComponent(self, state){
    self.setState(state);
    if(state.error !== undefined){
      if(state.error.httpCode === 401){
        self.clearError()
        self.changePage("stream", "", self.history)
      }
    }    
    if(self.hasLoaded === undefined){
      if(self.loading === undefined || !self.loading){
        self.props.loadStream(self.count, self.offset)
      }
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
      return (<Grid container>
          <Grid item xs={12} md={12} style={{"padding":"0px"}}>
            <Menu active="stream" settings={this.settings} userInfo={this.userInfo} pageSearch={this.searchForArticle}/>
            <StreamInfo userInfo={this.userInfo}/>
          </Grid>
          <Grid item xs={12}>
          {
            this.state.articles.length == 0
            ? <div className="container"><div className="progress"><div className="indeterminate"></div></div></div>
            : <ArticleCardList articles={this.state.articles} settings={this.settings} userInfo={this.userInfo} reviewArticle={this.reviewArticle}/>
          }
          </Grid>
        </Grid>
      );
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadStream:(count,offset) => dispatch(loadStreamAsync(count,offset)),
    reviewArticle: (article, history) => dispatch(reviewArticleAsync(article, history)),
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history)),
    clearError: () => dispatch(clearError())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo: state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamPageUnwrapped))
