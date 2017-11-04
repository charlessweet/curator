import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import ArticleReviewModal from '../controls/ArticleReviewModal'
import {Modal} from 'react-materialize'
import Article from '../model/Article'

class TestPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
	}

  componentWillMount(){
    this.setState({  
      article: new Article(42, "So Long and Thanks for all the Fish", "Everything you ever wanted to know about fishing nets.", "http://www.fishnet.com",
        ["fish", "nets"], 0.012, 0.345, 0.567)
    });
  }

	render(){
    console.log("TestPageUnwrapped_render", this.state)
      return (<ArticleReviewModal articleId={this.state.article.id} />)
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TestPageUnwrapped))