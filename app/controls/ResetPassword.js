import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import Card, {CardContent} from 'material-ui/Card'
import {resetPasswordAsync,changePage} from '../actions/actions'
import {connect} from 'react-redux'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import UserNotification from './UserNotification'

class ResetPassword extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.history = props.history;
		this.validation = {};
		this.changePassword = props.changePassword
		this.settings = props.settings
		this.passwordResetRequestId = props.match.params.resetPasswordRequestId
		this.changePage = props.changePage
	}

	handleInputChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({[name]: value});
	}

	handleSubmit(event){
		this.validation = this.validate();
		if(!this.validation.password){
			this.changePassword(this.passwordResetRequestId, this.state.password)
		}else{
			alert("The form is invalid.")
		}
	}

	validate(){
		return {
			//both password must be equal and not undefined
			password: this.state.password === undefined || this.state.password != this.state.pwconfirm
		}
	}

	render(){
		return  <Card>
					<CardContent>
		              <Typography type="headline" component="h4">
		                Reset my password
		              </Typography>
		              <Typography component="p">
		               Enter your new password and click the 
		              </Typography>
		            </CardContent>
					<CardContent>
						<form className="col s12">
						    <div className="row">
						        <div className="input-field col s12">
						          <input name="password" type="password" required className="validate" onChange={this.handleInputChange}></input>
						          <label htmlFor="password">Password</label>
						        </div>
						    </div>
						    <div className="row">
						        <div className="input-field col s12">
						          <input name="pwconfirm" type="password" required className="validate" onChange={this.handleInputChange}></input>
						          <label htmlFor="pwconfirm">Confirm Password</label>
						        </div>
						    </div>
						    <div className="row">
						        <div className="input-field col s12 white-text">
						          <Button id="update_password" type="button" onClick={this.handleSubmit} className="primary">{"Reset Now"}</Button>&nbsp;&nbsp;
						          <Button id="cancel" type="button" onClick={()=>{this.changePage('reset', '/', this.history)}} className="secondary">{"Cancel"}</Button>&nbsp;&nbsp;
						        </div>	  	
						    </div>
				  		</form>
						<UserNotification triggerGroup="notify" triggerState="resetSucceeded" message="Password successfully changed" />
						<UserNotification triggerGroup="notify" triggerState="failed" message="Password change attempt failed." />
		  			</CardContent>
		  		</Card>	
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePassword: (passwordResetRequestId, newPassword) => dispatch(resetPasswordAsync(passwordResetRequestId, newPassword)),
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));