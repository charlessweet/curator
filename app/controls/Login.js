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
			this.login(this.state.email, this.state.password) 			
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
		console.log("login", this.state)
	    let fullWidth = {
	    	"width":"100%"
	    }
	    let barStyle = {
	      "backgroundColor": "#3F51B5",
	      "color": "white"
	    }
		return 	<div>
				<form className="col s12">
					<h5>Log In to Curator</h5>
					<input style={fullWidth} id="email" label="Email Address" onChange={this.handleInputChange}/><br/>
					<input style={fullWidth} id="password" type="Password" label="Password"  onChange={this.handleInputChange}/><br/>
					<br/>
					<Button id="login" type="button" onClick={this.handleSubmit} className="primary">{"Login"}</Button>&nbsp;&nbsp;
	              	<Button id="create_member" onClick={()=>{this.changePage("login", "create", this.history)}}>Create an Account</Button>&nbsp;&nbsp;
					<Button id="cancel" type="button" onClick={this.handleCancel} className="secondary">{"Cancel"}</Button>
					<UserNotification triggerGroup="notify" triggerState="loginFailed" message="Login failed" />
				</form>
		  	</div>			
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginWithUserNameAndPassword: (email, password) => dispatch(loginBasicAsync(email, password)),
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