import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'
import Card, {CardContent} from 'material-ui/Card'
import Select from 'material-ui/Select'
import {requestRoleAsync} from '../actions/actions'
import {connect} from 'react-redux'
import Button from 'material-ui/Button'
import MenuItem from 'material-ui/Menu'
import Typography from 'material-ui/Typography'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import UserNotification from './UserNotification'

class RoleRequest extends React.Component{
	constructor(props){
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.history = props.history;
		this.validation = {};
		this.requestRole = props.requestRole
		this.settings = props.settings
		this.userInfo = new UserIdentity(Auth.getDecodedJwt())
		this.state = { "roleName" : "guardian", "targetMemberId" : this.userInfo.memberId};
	}

	handleInputChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({[name]: value});
	}

	handleSubmit(event){
		this.validation = this.validate();
		if(!this.validation.targetMemberId && !this.validation.roleName){
			this.requestRole(this.settings, this.state.targetMemberId, this.state.roleName)
		}else{
			alert("The form is invalid.")
		}
	}

	validate(){
		return {
			//both password must be equal and not undefined
			targetMemberId: this.state.targetMemberId === undefined,
			roleName: this.state.roleName !== "guardian"
		}
	}

	render(){
		return  (this.userInfo.roles === undefined || this.userInfo.roles.indexOf("guardian") == -1 ?
			<Card>
				<CardContent>
		            <Typography type="headline" component="h4">
		                {"Request an additional role"}
		            </Typography>
					<Select name="roleName" value="guardian" onChange={this.handleInputChange}>
						<MenuItem value="guardian">Guardian</MenuItem>
					</Select>
					<div>
						<button className='btn waves-effect waves-light indigo lighten-1' label="Request Role" onClick={this.handleSubmit}>Request Role</button>
					</div>
					<Typography component="p">
					A Guardian is a critically-minded person who can distinguish between logical and illogical arguments, and 
					detect logical faults in articles to point out to others. A Guardian must also be willing and able to analyze
					content for things taken out-of-context, and point this out to others. This person would be diligent and 
					detail-oriented. If this seems like you, request to be a Guardian today!
					</Typography>
					<UserNotification triggerGroup="notify" triggerState="roleRequested" message="Role of Guardian requested" />
		  		</CardContent>
		  	</Card>	: null)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    requestRole: (settings, targetMemberId, roleName) => dispatch(requestRoleAsync(settings, targetMemberId, roleName))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RoleRequest))