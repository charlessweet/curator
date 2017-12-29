import React from 'react'
import ReactDOM from 'react-dom'
import { Link, withRouter } from 'react-router-dom'
import {PropTypes} from 'prop-types'
import store from '../store'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import Button from 'material-ui/Button'
import {connect} from 'react-redux'
import {loginBasicAsync, changePage} from '../actions/actions'
import UserNotification from './UserNotification'

class Login extends React.Component{
	constructor(props){
		super(props) 
		this.state = {} 
		this.handleInputChange = this.handleInputChange.bind(this) 
		this.handleSubmit = this.handleSubmit.bind(this)
		this.history = props.history
		this.target = props.target
		this.emailRegex = /^\S+@\S+\.\S+$/ 
		this.validation = {} 
		this.login = props.loginWithUserNameAndPassword
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
			this.login(storeState.settings, this.state.email, this.state.password, this.history) 			
		}else{
			alert("The form is invalid.") 
		}
	}
	handleCancel(event){
		this.changePage("create", "/", this.history)
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
			email: this.state.email === undefined && !this.emailRegex.test(this.state.email),
			password: this.state.password === undefined
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
		return 	<div>
				<h5>Log In to Curator</h5>
				<TextField style={fullWidth} id="email" label="Email Address" onChange={this.handleInputChange}/><br/>
				<TextField style={fullWidth} id="password" type="Password" label="Password"  onChange={this.handleInputChange}/><br/>
				<br/>
				<button id="create_member" type="button" onClick={this.handleSubmit} className="btn-large waves-effect waves-light indigo lighten-1">{"Login"}</button>&nbsp;&nbsp;
				<button id="cancel" type="button" onClick={this.handleCancel} className="btn-large waves-effect waves-light grey lighten-1">{"Cancel"}</button>&nbsp;&nbsp;
				<UserNotification triggerGroup="notify" triggerState="loginFailed" message="Login failed" />
		  	</div>			
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginWithUserNameAndPassword: (settings, email, password, history) => dispatch(loginBasicAsync(settings, email, password, history)),
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo: state.identity.userInfo
  }
}

Login.propTypes = {
	//this pulls from the 
	target: PropTypes.string.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))