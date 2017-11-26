import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import {critiqueArticleAsync} from '../actions/actions'
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Critique from '../model/Critique'
import Divider from 'material-ui/Divider'

class StateAwareSnackBar extends React.Component{
	constructor(props){
		super(props)
		this.history = props.history
		this.critiqueArticle = props.critiqueArticle
		this.settings = props.settings

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.handleCritiqueClick = this.handleCritiqueClick.bind(this)

		this.state = {}
		this.validation = {}
		this.showCritiqueEntryForm = false
		this.articleId = props.article.id
	}

	handleInputChange(event){
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name
		this.setState({[name]: value})
		console.log(name, value)
	}

	validate(){
		return {
			//both password must be equal and not undefined
			analysis: this.state.analysis === undefined
		}
	}

	handleSubmit(event){
		this.validation = this.validate()
		if(!this.validation.analysis){
			let cr = new Critique(this.state.paragraph_number, this.state.sentence_number, this.state.quote, this.state.analysis, this.state.error_type)
			this.critiqueArticle(this.articleId, cr, this.settings)
			this.setState({showCritiqueEntryForm:false})
		}else{
			alert("Please add a critiqueto display.")
		}
	}

	componentWillMount(){
		if(this.hasMounted === undefined){
	    	let state = store.getState()
			this.hasMounted = true		
		}
	}

	handleCritiqueClick(event){
		this.setState({showCritiqueEntryForm:true})
	}

	handleCancel(event){
		this.setState({showCritiqueEntryForm:false})		
	}

	render(){
		if(this.state.showCritiqueEntryForm){
			return <div>
					<Divider />
					<TextField name="analysis" fullWidth={true} multiLine={true} rows={5} rowsMax={5} placeholder="Enter objective critique information that will help others determine the validity of this article." onChange={this.handleInputChange}/>
					<br/>
                	<TextField name="paragraph_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate paragraph number, 0 if general" />
                	<TextField name="sentence_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate sentence number, 0 if general" />
					<TextField name="quote" fullWidth={true} multiLine={true} rows={3} rowsMax={3} placeholder="Enter an example quotation from the article." onChange={this.handleInputChange}/>
					<RadioButtonGroup name="error_type">
						<RadioButton id="factual-error" name="factual-error" onClick={this.handleInputChange} label="Factual Error" value="factual-error"/>
						<RadioButton id="logical-error" name="logical-error" onClick={this.handleInputChange} label="Logical Error" value="logical-error"/>
					</RadioButtonGroup>
					<a onClick={this.handleSubmit}>save</a>&nbsp;&nbsp;<a onClick={this.handleCancel}>cancel</a>
				</div>
		}else{
			return <div>
				<Divider />
				<a onClick={this.handleCritiqueClick}>add critique</a>
			</div>
		}
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    critiqueArticle: (articleId, critique, settings, userInfo) => dispatch(critiqueArticleAsync(articleId, critique, settings, userInfo))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StateAwareSnackBar))