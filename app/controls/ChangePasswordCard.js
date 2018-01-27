import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import Card, {CardContent} from 'material-ui/Card'
import {changePasswordAsync} from '../actions/actions'
import {connect} from 'react-redux'
import Typography from 'material-ui/Typography'
import UserNotification from './UserNotification'
import Button from 'material-ui/Button'

class ChangePassword extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.history = props.history;
		this.emailRegex = /^\S+@\S+\.\S+$/;
		this.validation = {};
		this.changePassword = props.changePassword
		this.settings = props.settings
		this.userInfo = props.userInfo
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
			this.changePassword(this.state.password)
		}else{
			alert("The form is invalid.")
		}
	}

	componentWillMount(){
		if(this.hasMounted === undefined){
	    	let state = store.getState();
			this.setState({["isMember"]:this.userInfo.memberId !== undefined})
			if(this.userInfo.roles !== undefined){
				this.setState({["isGuardian"]:this.userInfo.roles.filter((x) => x === "guardian") !== undefined })
				this.setState({["guardian"]:this.userInfo.roles.filter((x) => x === "guardian") !== undefined })				
			}
			if(this.userInfo.email !== undefined){
				this.setState({["email"]:this.userInfo.email})			
			}
			this.hasMounted = true		
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
		                Change my password
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
						          <Button id="create_member" type="button" onClick={this.handleSubmit} className="primary">{"Save Changes"}</Button>&nbsp;&nbsp;
						        </div>	  	
						    </div>
				  		</form>
						<UserNotification triggerGroup="notify" triggerState="passwordChanged" message="Password successfully changed" />				  		
		  			</CardContent>
		  		</Card>	
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePassword: (newPassword) => dispatch(changePasswordAsync(newPassword))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChangePassword));