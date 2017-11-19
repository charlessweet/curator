import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import ChangePasswordCard from '../controls/ChangePasswordCard'
import {createBiasCheckerAccountFromFacebookAsync} from '../actions/actions'
import ProfileInfo from '../controls/ProfileInfo'
import RoleRequest from '../controls/RoleRequest'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'

class ProfilePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.history = props.history
    this.changePage = props.changePage
	}

	render(){
      return (<div id="profile-page">
        <Menu active="profile" settings={this.settings} userInfo={this.userInfo}/>
        <ProfileInfo userInfo={this.userInfo}/>
        <div className="container">
          <RoleRequest userInfo={this.userInfo}/>
        </div>
        <div className="container">
          <ChangePasswordCard userInfo={this.userInfo}/>
        </div>
      </div>
      )
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      changePage: (currentPage, targetPage, history) => {
      dispatch(changePage(currentPage, targetPage, history));
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfilePageUnwrapped))