import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import ChangePasswordCard from '../controls/ChangePasswordCard'
import ProfileInfo from '../controls/ProfileInfo'
import RoleRequest from '../controls/RoleRequest'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import LinkToFacebookCard from '../controls/LinkToFacebookCard'
import AuthController from '../controls/AuthController'
import Settings from '../model/Settings'
import Grid from 'material-ui/Grid'

class ProfilePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.settings = new Settings()
	}

	render(){
      return (<div id="profile-page">
        <AuthController />
        <Menu active="profile" settings={this.settings} userInfo={this.userInfo}/>
        <Grid container>
          <Grid item xs={12} md={4}>
            <ProfileInfo userInfo={this.userInfo}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <ChangePasswordCard userInfo={this.userInfo}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <LinkToFacebookCard />
          </Grid>
          <Grid item xs={12} md={4}>
            <RoleRequest userInfo={this.userInfo}/>
          </Grid>
        </Grid>
        </div>
      )
  }
};

export default ProfilePageUnwrapped