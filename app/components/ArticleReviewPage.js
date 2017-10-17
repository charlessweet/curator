import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import ArticleReviewModal from '../controls/ArticleReviewModal'
import {Modal} from 'react-materialize'
import {critiqueArticleAsync} from '../actions/actions'

class ArticleReviewPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = props.userInfo
    this.articleId = props.match.params.articleId
	}
  
  selectState(superState){
    return { article:superState.articleList.currentArticle, identity: superState.identity, showReview: false };
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
      && subStateA.identity.userInfo.biasToken === subStateB.identity.userInfo.biasToken
      && subStateA.article !== undefined
      && subStateB.article !== undefined
      && subStateA.article.id === subStateB.article.id
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
//      console.log(this.state.article)
      let index = 0
      return (<div id="bookmark-page">
        <Menu showNav={false} settings={this.settings} userInfo={this.userInfo}/>
        <Link to="/stream"><i className="material-icons">arrow_back</i></Link>
        <br/> <br/>
        <div className="container">
          <h2>
            {this.state.article.title}
          </h2>
          <p>
            {this.state.article.summary}
          </p>
          <div>
            <a target="_blank" href={this.state.article.link}>Display Article In Separate Tab</a>
          </div>
          <ul className="collection with-header">
            <li className="collection-header"><h4>Problems with Article</h4> <ArticleReviewModal articleId={this.state.article.id} /></li>
            {
              (this.state.article.critiques !== undefined ? 
              this.state.article.critiques.sort((x,y)=>{ return (x.paragraph * 100 + x.sentence) - (y.paragraph * 100 + y.sentence) })
                .map((c) => {
                return <li className="collection-item" key={index++}>
                    <p className="secondary-content chip">{c.errorType}</p>
                    <p>From paragraph {c.paragraph}, sentence {c.sentence}...</p>
                    <p><i>...{c.quote}...</i></p>
                    <p><b>{c.analysis}</b></p> 
                </li>
              }) : <li className="collection-item">No critiques found.</li>)
            }
          </ul>
        </div>
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