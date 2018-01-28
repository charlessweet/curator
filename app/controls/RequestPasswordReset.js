import React from 'react'
import ReactDOM from 'react-dom'
import { Link, withRouter } from 'react-router-dom'
import {PropTypes} from 'prop-types'
import store from '../store'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import Button from 'material-ui/Button'
import {connect} from 'react-redux'
import {requestPasswordResetAsync, changePage} from '../actions/actions'
import UserNotification from './UserNotification'

class ResetPassword extends React.Component{
	constructor(props){
		super(props) 
		this.state = {} 
		this.handleInputChange = this.handleInputChange.bind(this) 
		this.handleSubmit = this.handleSubmit.bind(this)
		this.history = props.history
		this.target = props.target
		this.emailRegex = /^\S+@\S+\.\S+$/ 
		this.validation = {} 
		this.requestPasswordReset = props.requestPasswordReset
		this.handleCancel = this.handleCancel.bind(this)
		this.changePage = props.changePage
	}

	handleInputChange(event){
		const target = event.target
		const value = target.value
		const name = target.id
		this.setState({[name]: value})
	}

	handleSubmit(event){
		this.validation = this.validate() 
		if(!this.validation.email && !this.validation.password){
			let storeState = store.getState() 
			this.requestPasswordReset(this.state.email)		
		}else{
			alert("The form is invalid.") 
		}
	}
	handleCancel(event){
		this.changePage("reset", "login", this.history)
	}

	componentWillMount(){
		this.setState(this.selectState(store.getState()));		
	}

	componentDidMount(){
		this.action = this.login
	}

	selectState(superState){
		return {"settings":superState.settings, "page":superState.page, identity: superState.identity.userInfo};
	}

	validate(){
		return {
			email: this.state.email === undefined && !this.emailRegex.test(this.state.email)
		}
	}

	render(){
	    let fullWidth = {
	    	"width":"100%"
	    }
	    let barStyle = {
	      "backgroundColor": "#3F51B5",
	      "color": "white"
	    }
		return 	<div className="container">
				<form className="col s12">
					<h5>Request a Password Reset</h5>
					<p>Enter the information below to request a password reset code. The code will be sent to your email address, and is good
					for a limited time after the button is clicked.</p>
					<input style={fullWidth} id="email" type="email" label="Email Address" onChange={this.handleInputChange}/><br/>
					<label htmlFor="email">Email</label>
					<br/>
					<Button id="reset" type="button" onClick={this.handleSubmit} className="primary">{"Reset Password"}</Button>&nbsp;&nbsp;
					<Button id="cancel" type="button" onClick={this.handleCancel} className="secondary">{"Cancel"}</Button>
					<UserNotification triggerGroup="notify" triggerState="failed" message="Reset password failed." />
					<UserNotification triggerGroup="notify" triggerState="resetRequestSucceeded" message="Reset password succeeded. Please check your email." />
				</form>
		  	</div>			
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history)),
    requestPasswordReset: (email) => dispatch(requestPasswordResetAsync(email))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo: state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword))