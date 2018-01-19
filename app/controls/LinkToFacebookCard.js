import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import store from '../store'
import {linkToFacebookAsync} from '../actions/actions'
import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Card, {CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import UserNotification from './UserNotification'

class LinkToFacebookCard extends React.Component{
	constructor(props){
		super(props)
		this.state = { "loggedInToFacebook" : false}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
		this.linkToFacebook = props.linkToFacebook
		this.settings = props.settings
		this.userInfo = props.userInfo
	}

	handleSubmit(){
		//console.log("clicked")
		this.linkToFacebook(this.facebookToken)
	}

	handleLogin(){
		self = this
		FB.login(function(response) {
		    if (response.authResponse) {
		     FB.api('/me', function(response) {
		     	self.facebookUserId = response.id
    	  		self.setState({"loggedInToFacebook" : true})
		     });
		    } else {
		     console.log('User cancelled login or did not fully authorize.');
		    }
		});		
	}

	componentWillMount(){
		let fbInit = {
		    cookie     : true,  // enable cookies to allow the server to access 
		                        // the session
		    xfbml      : true,  // parse social plugins on this page
		    version    : 'v2.8' // use graph api version 2.8
		}
		fbInit.appId = this.settings.fbAppId
		let self = this
		window.fbAsyncInit = function() {
			FB.init(fbInit);

			FB.getLoginStatus(function(response) {
				//if already logged in, use that information when mounting the component (only)
				if(response.status == 'connected'){
    	  			self.facebookUserId = response.authResponse.userID
    	  			self.setState({"loggedInToFacebook" : true})			
				}else{ //not logged in
					self.loggedInToFacebook = false
    	  			self.setState({"loggedInToFacebook" : false})			
				}
	    	});
		}
		let d = document
		let s = 'script'
		let id = 'facebook-jssdk'
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) return;
	    js = d.createElement(s); js.id = id;
	    js.src = "https://connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	}

	render(){
		let loginActionDiv = <div>You are not logged in. You must log in to Facebook to import your articles from biaschecker.org.<br/><br/><button className='btn waves-effect waves-light indigo lighten-1' onClick={this.handleLogin}>Login to Facebook</button></div>
		if(this.state.loggedInToFacebook){
			loginActionDiv = <div>Great news! You are logged in. Please click on the button to import your articles.<br/><br/>
			<button className='btn waves-effect waves-light indigo lighten-1' onClick={this.handleSubmit}>Import Articles</button>
			</div>
		}
		return <Card>
					<CardContent>
		              <Typography type="headline" component="h4">
		                Import from BiasChecker.org
		              </Typography>
		            </CardContent>		
				<CardContent>
					<p>If you had any articles previously in BiasChecker before the transition to the new Curator site, please
					use this panel to import those records.</p>
					{loginActionDiv}
					<UserNotification triggerGroup="notify" triggerState="existingLinksImported" message="Existing records imported" />
				</CardContent>
		  	</Card>
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    linkToFacebook: (facebookToken) => dispatch(linkToFacebookAsync(facebookToken))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinkToFacebookCard))