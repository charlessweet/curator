import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {changePasswordAsync} from '../actions/actions'
import {connect} from 'react-redux'

class ChangePassword extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.history = props.history;
		this.emailRegex = /^\S+@\S+\.\S+$/;
		this.validation = {};
		this.changePassword = props.changePassword
		this.settings = props.settings
		console.log("constructor",props)
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
			this.changePassword(this.state.password,this.settings)
		}else{
			alert("The form is invalid.")
		}
	}

	handleCancel(event){
		this.history.push("/articles");
	}

	componentWillMount(){
		if(this.hasMounted === undefined){
	    	let state = store.getState();
			this.setState({["isMember"]:state.identity.userInfo.memberId !== undefined})
			if(state.identity.userInfo.roles !== undefined){
				this.setState({["isGuardian"]:state.identity.userInfo.roles.filter((x) => x === "guardian") !== undefined })
				this.setState({["guardian"]:state.identity.userInfo.roles.filter((x) => x === "guardian") !== undefined })				
			}
			if(state.identity.userInfo.email !== undefined){
				this.setState({["email"]:state.identity.userInfo.email})			
			}
			this.hasMounted = true		
		}
	}

	componentDidMount(){
		if(this.state.isMember){
			this.action = this.createMembership
		}else{
			this.action = this.updateMembership
		}
//		console.log(this.state)
	}

	validate(){
		return {
			//both password must be equal and not undefined
			password: this.state.password === undefined || this.state.password != this.state.pwconfirm
		}
	}

	render(){
//		console.log(this.state)
		return  <Card>
					<CardHeader
						title={"Change my password"}
					/>
				<CardText>
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
					          <button id="create_member" type="button" onClick={this.handleSubmit} className="btn-large waves-effect waves-light indigo lighten-1">{"Save Changes"}</button>&nbsp;&nbsp;
					        </div>	  	
					    </div>
			  		</form>
		  		</CardText>
		  	</Card>	
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePassword: (newPassword,settings) => dispatch(changePasswordAsync(newPassword,settings))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChangePassword));