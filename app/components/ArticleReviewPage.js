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

class ArticleReviewPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.articleId = props.match.params.articleId
	}
  
  selectState(superState){
    return { article:superState.articleList.currentArticle, showReview: false };
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
  }

	render(){
      let index = 0
      return (
        <div id="article-review-page" className="container">
          <Menu showNav={false} settings={this.settings} userInfo={this.userInfo}/>
          <Link to="/stream"><i className="material-icons">arrow_back</i></Link>
          <ReviewResultsInfo />
          <ReviewDetailsCard article={this.state.article} />
        </div>
      )
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleReviewPageUnwrapped))