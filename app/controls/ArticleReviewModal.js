import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import {Modal, Button, Icon} from 'react-materialize'
import {critiqueArticleAsync} from '../actions/actions'
import Critique from '../model/Critique'

class ArticleReviewModal extends React.Component{
	constructor(props){
		super(props);
//		console.log(props)
	    this.settings = props.settings
    	this.userInfo = props.userInfo
    	this.articleId = props.articleId
    	this.critiqueArticle = props.critiqueArticle
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);   	
	}

	handleInputChange(event){
		const target = event.target;
		const value = target.type == 'radio' ? target.id : target.value
		const name = target.name;
		this.setState({[name]: value});
	}

	handleSubmit(event){
		let cr = new Critique(this.state.paragraph_number, this.state.sentence_number, this.state.quote,
			this.state.analysis, this.state.error_type)
		this.critiqueArticle(this.articleId, cr, this.settings, this.userInfo)
	}

	render(){
		return <Modal header="Add Inaccuracy Details" trigger={<Button waves='light' className="indigo">Add Critique</Button>} actions={
    <div>
      <Button modal="close" waves="light" className="red darken-2" onClick={ this.handleSubmit }><Icon left>add</Icon>add</Button>
      <Button flat modal="close" waves="light">dismiss</Button>
    </div>
  }>
			  <p>
			  Add details specifying where in the article the inaccuracy occurs, and what type of 
			  inaccuracy you are seeing.
			  </p>
              <form>
                <input name="paragraph_number" onInput={this.handleInputChange} type="number" placeholder="paragraph number"></input>
                <input name="sentence_number"  onInput={this.handleInputChange} type="number" placeholder="sentence number"></input>
                <textarea name="quote" onInput={this.handleInputChange} className="materialize-textarea" placeholder="quote"></textarea>
                <textarea name="analysis" onInput={this.handleInputChange} className="materialize-textarea" placeholder="analysis"></textarea>
                <div className="row">
                  <div className="col s4">
                    <input className="with-gap" onChange={this.handleInputChange} name="error_type" type="radio" id="factual-error" />
                    <label htmlFor="factual-error">Factual Error</label>
                  </div>
                  <div className="col s4">
                    <input className="with-gap" onChange={this.handleInputChange} name="error_type" type="radio" id="logical-error" />
                    <label htmlFor="logical-error">Logical Error</label>
                  </div>
                  <div className="col s4">
                    <input className="with-gap" onChange={this.handleInputChange} name="error_type" type="radio" id="out-of-context"  />
                    <label htmlFor="out-of-context">Out of Context</label>
                  </div>
                </div>
              </form>
        </Modal>
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    critiqueArticle: (articleId, critique, settings, userInfo) => dispatch(critiqueArticleAsync(articleId, critique, settings, userInfo))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleReviewModal));