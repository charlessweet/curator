import React from 'react'
import ReactDOM from 'react-dom'
import FacebookLogin from 'react-facebook-login'
import {withRouter, browserHistory} from 'react-router'
import {indicatePageWasLoaded, loginAsync} from '../actions/index'

class LoginButton extends React.Component{
	constructor(props){
		super(props);
		this.login = props.login;
		this.settings = props.settings.settings;
		this.location = props.location;
		this.history = props.history;
	}
	processFacebookLogin(facebookResponse, settings, history, login){
		login(settings, facebookResponse, history);
	}
	render(){
        return <FacebookLogin
			appId={this.settings.fbAppId}
			autoLoad={true}
			fields="name,email,picture"
			scope='user_posts,publish_actions,user_friends,user_status'
          	cssClass='btn-large  waves-effect waves-light indigo lighten-1'
        	callback={(response)=>{this.processFacebookLogin(response, this.settings, this.history, this.login)}}
		/>		
	}
}

export default withRouter(LoginButton);