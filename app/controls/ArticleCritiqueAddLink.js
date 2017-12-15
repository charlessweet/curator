import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import {critiqueArticleAsync} from '../actions/actions'
import {connect} from 'react-redux'
import TextField from 'material-ui/TextField'
import Radio, {RadioGroup} from 'material-ui/Radio';
import Critique from '../model/Critique'
import Divider from 'material-ui/Divider'
import SnackBar from 'material-ui/Snackbar'
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'

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
		const value = target.type === 'checkbox' ? target.checked : target.value
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
			let cr = new Critique(this.state.paragraph_number, this.state.sentence_number, this.state.quote, this.state.analysis, this.state.error_type, this.userInfo.memberId, this.userInfo.userName)
			console.log("handleSubmit", cr, this.userInfo)
			this.critiqueArticle(this.articleId, cr, this.settings)
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
					<TextField name="analysis" fullWidth={true} multiLine={true} rows={5} rowsMax={5} placeholder="Enter objective critique information that will help others determine the validity of this article." onChange={this.handleInputChange}/>
					<br/>
                	<TextField name="paragraph_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate paragraph number, 0 if general" />
                	<TextField name="sentence_number" fullWidth={true} onInput={this.handleInputChange} type="number" placeholder="approximate sentence number, 0 if general" />
					<TextField name="quote" fullWidth={true} multiLine={true} rows={3} rowsMax={3} placeholder="Enter an example quotation from the article." onChange={this.handleInputChange}/>
					<RadioGroup name="error_type">
						<FormControlLabel control={<Radio/>} id="factual-error" name="factual-error" onClick={this.handleInputChange} label="Factual Error" value="factual-error"/>
						<FormControlLabel control={<Radio/>} id="logical-error" name="logical-error" onClick={this.handleInputChange} label="Logical Error" value="logical-error"/>
					</RadioGroup>
					<a onClick={this.handleSubmit}>save</a>&nbsp;&nbsp;<a onClick={this.handleCancel}>cancel</a>
				</div>
		}else{
			if(this.userInfo.roles.indexOf("guardian") > -1){
				return <div>
					<Divider />
					<a onClick={this.handleCritiqueClick}>add critique</a>
					<SnackBar open={this.state.showConfirmation} message="Analysis saved" autoHideDuration={400} onRequestClose={this.handleConfirmationClosed} />
				</div>
			}else{
				return null
			}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArticleCritiqueAddLink))