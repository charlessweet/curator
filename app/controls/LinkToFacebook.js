import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import store from '../store'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import {linkToFacebookAsync} from '../actions/actions'
import FacebookLogin from 'react-facebook-login'
import RaisedButton from 'material-ui/RaisedButton'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'

class LinkToFacebookCard extends React.Component{
	constructor(props){
		super(props)
		this.state = { "showFBLogin" : true}
		this.processFacebookLogin =this.processFacebookLogin.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.linkToFacebook = props.linkToFacebook
		this.settings = props.settings
		this.userInfo = props.userInfo
		//    FB.getLoginStatus(updateStatusCallback);
	}

	processFacebookLogin(facebookResponse, settings){
		this.facebookToken = facebookResponse
		console.log(facebookResponse)
		if(facebookResponse.status === undefined){
			this.setState({"showFBLogin" : false})			
		}
		//this.linkToFacebook(settings, facebookResponse);
	}

	handleSubmit(){
		console.log("clicked")
		this.linkToFacebook(this.facebookToken)
	}

	render(){
		return  <Card>
				<CardHeader title={"Import from BiasChecker.org"} />
				<CardText>
					<p>If you had any articles previously in BiasChecker before the transition to the new Curator site, please
					use this panel to import those records.</p>
					{(this.state.showFBLogin ?
					<FacebookLogin
						appId={this.settings.fbAppId}
						autoLoad={true}
						fields="name,email,picture"
						scope='user_posts,publish_actions,user_friends,user_status'
						callback={(response)=>{this.processFacebookLogin(response, this.settings)}}
					/>: 
					<div>
						<center><Avatar src={this.facebookToken.picture.data.url} size={this.facebookToken.picture.data.height} /></center>
						<center><span>{this.facebookToken.name}</span></center>
					</div>)}
		  		</CardText>
		  		<CardActions>
		  			<RaisedButton label="Import Articles" fullWidth={true} primary={true} onClick={this.handleSubmit} />
		  		</CardActions>
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