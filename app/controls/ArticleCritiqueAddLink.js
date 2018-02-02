import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import {critiqueArticleAsync} from '../actions/actions'
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField'
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { FormControlLabel } from 'material-ui/Form'
import Critique from '../model/Critique'
import Divider from 'material-ui/Divider'
import SnackBar from 'material-ui/Snackbar'
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'
import Input, { InputLabel } from 'material-ui/Input';

class ArticleCritiqueAddLink extends React.Component{
	constructor(props){
		super(props)
		this.userInfo = new UserIdentity(Auth.getDecodedJwt())
		this.history = props.history
		this.critiqueArticle = props.critiqueArticle
		this.settings = props.settings

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.handleCritiqueClick = this.handleCritiqueClick.bind(this)
		this.handleConfirmationClosed = this.handleConfirmationClosed.bind(this)

		this.state = {}
		this.state.showCritiqueEntryForm = false
		this.state.showConfirmation = false

		this.validation = {}
		this.articleId = props.article.id
	}

	handleInputChange(event){
		const target = event.target
		const value = target.value
		const name = target.name
		this.setState({[name]: value})
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
			//articleId, errorType, analysis, quotation, paragraphIndex, sentenceIndex
			this.critiqueArticle(this.articleId, this.state.error_type, this.state.analysis, this.state.quote, this.state.paragraph_number, this.state.sentence_number)
			this.setState({showCritiqueEntryForm:false, showConfirmation:true})
		}else{
			alert("Please add a critiqueto display.")
		}
	}

	handleCritiqueClick(event){
		this.setState({showCritiqueEntryForm:true})
	}

	handleCancel(event){
		this.setState({showCritiqueEntryForm:false})		
	}

	handleConfirmationClosed(event){
		let stateCopy = Object.assign({}, this.state)
		stateCopy.showConfirmation = false
		this.setState(stateCopy)
	}

	render(){
		if(this.state.showCritiqueEntryForm){
			return <div>
					<Divider />
					<FormControl>
						<InputLabel htmlFor="error-type">Error Type</InputLabel>
						<Select onChange={this.handleInputChange} value="factual-error" name="error_type">
							<MenuItem value="factual-error">Factual Error</MenuItem>
							<MenuItem value="logical-error">Logical Error</MenuItem>
						</Select>
					</FormControl>
					<br/><br/>
					<TextField name="analysis" fullWidth={true} multiline rows={5} rowsMax={5} placeholder="Enter objective critique information that will help others determine the validity of this article." onChange={this.handleInputChange}/>
					<br/>
                	<TextField name="paragraph_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate paragraph number, 0 if general" />
                	<TextField name="sentence_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate sentence number, 0 if general" />
					<TextField name="quote" fullWidth={true} multiline rows={3} rowsMax={3} placeholder="Enter an example quotation from the article." onChange={this.handleInputChange}/>
					<a onClick={this.handleSubmit}>save</a>&nbsp;&nbsp;<a onClick={this.handleCancel}>cancel</a>
				</div>
		}else{
			if(this.userInfo.roles.indexOf("guardian") > -1){
				return <div>
					<Divider />
					<a onClick={this.handleCritiqueClick}>add critique</a>
					<SnackBar open={this.state.showConfirmation} message="Analysis saved" autoHideDuration={400} onClose={this.handleConfirmationClosed} />
				</div>
			}else{
				return null
			}
		}
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    critiqueArticle: (articleId, errorType, analysis, quotation, paragraphIndex, sentenceIndex) => dispatch(critiqueArticleAsync(articleId, errorType, analysis, quotation, paragraphIndex, sentenceIndex))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleCritiqueAddLink))