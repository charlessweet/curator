import React from 'react'
import ReactDOM from 'react-dom'
import { Link, withRouter } from 'react-router-dom'
import {PropTypes} from 'prop-types'
import store from '../store'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
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
		console.log(store.getState())
	    let barStyle = {
	      "backgroundColor": "#3F51B5",
	      "color": "white"
	    }		
		return 	<div className="container">
				<Paper zDepth={0}>
					<br/><br/><br/>
					<h5>Log In to Curator</h5>
					<TextField id="email" label="Email Address" hintText="Email Address" fullWidth={true}  onChange={this.handleInputChange}/><br/>
					<TextField id="password" label="Password" type="Password" fullWidth={true} hintText="Password"  onChange={this.handleInputChange}/><br/>
					<br/>
					<RaisedButton label="Log In" style={barStyle} fullWidth={true} primary={true} onClick={this.handleSubmit} /><br/><br/>
					<Divider />
					<center>
					<br/><br/>
					<div>No account?</div>
					<Link to="/create">Create an Account</Link>
					</center>
				</Paper>
				<Divider />
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