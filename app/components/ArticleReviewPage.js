import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import {Modal} from 'react-materialize'
import {critiqueArticleAsync} from '../actions/actions'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'
import ReviewResultsInfo from '../controls/ReviewResultsInfo'
import ReviewDetailsCard from '../controls/ReviewDetailsCard'
import {reviewArticleAsync, changePage} from '../actions/actions'
import Grid from 'material-ui/Grid'

class ArticleReviewPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.articleId = props.match.params.articleId
    this.reviewArticle = props.reviewArticle
    this.history = props.history
    this.changePage = props.changePage
	}
  
  selectState(superState){
    return { article:superState.articleList.currentArticle, showReview: false, error:superState.failure.error };
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
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
    //check for auth error and redirect if we can't log in
    if(state.error !== undefined){
      if(state.error.httpCode === 401){
        self.changePage("article", "", self.history)
      }
    }

    //
    if(self.state.article === undefined && this.hasLoaded === undefined){
      self.reviewArticle(self.articleId, self.history)
      this.hasLoaded = true
    }
  }

	render(){
    if(this.state.error !== undefined && this.state.error == "Failed to validate JWT"){
      return null
    }
    let index = 0
    if(this.state.article !== undefined){
      return (
        <Grid container>
          <Grid item xs={12} md={12}>
            <Menu showNav={false} settings={this.settings} userInfo={this.userInfo}/>
            <Link to="/stream"><i className="material-icons">arrow_back</i></Link>
          </Grid>
          <Grid item xs={12}>          
            <ReviewResultsInfo />
          </Grid>
          <Grid item xs={12}>
            <ReviewDetailsCard article={this.state.article} />
          </Grid>
        </Grid>
      )        
    }else{
      return null
    }
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    reviewArticle: (articleId, history) => dispatch(reviewArticleAsync(articleId, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleReviewPageUnwrapped))