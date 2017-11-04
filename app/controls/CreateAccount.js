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
import {loginBasicAsync} from '../actions/actions'

class CreateAccount extends React.Component{
	constructor(props){
		super(props) 
		this.state = {} 
		this.handleInputChange = this.handleInputChange.bind(this) 
		this.handleSubmit = this.handleSubmit.bind(this) 
		this.handleCancel = this.handleCancel.bind(this) 
		this.history = props.history
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

	handleCancel(event){
		this.history.push("/")
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
		return 	<div className="container">
				<Paper zDepth={0}>
					<br/><br/><br/>
					<h5>Log In to Curator</h5>
					<TextField id="email" label="Email Address" hintText="Email Address" fullWidth={true}  onChange={this.handleInputChange}/><br/>
					<TextField id="password" label="Password" type="Password" fullWidth={true} hintText="Password"  onChange={this.handleInputChange}/><br/>
					<TextField id="password2" label="Password" type="Password" fullWidth={true} hintText="Password"  onChange={this.handleInputChange}/><br/>
					<br/>
					<RaisedButton label="Create" fullWidth={true} primary={true} onClick={this.handleSubmit} /><br/><br/>
					<Divider />
					<center>
					<br/><br/>
					</center>
				</Paper>
				<Divider />
		  	</div>			
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createBiasCheckerAccount: (settings, email, password, history) => dispatch(createAccountAsync(settings, email, password, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

CreateAccount.propTypes = {
	createAccountAsync: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateAccount))