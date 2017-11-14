import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import ChangePasswordCard from '../controls/ChangePasswordCard'
import {createBiasCheckerAccountFromFacebookAsync} from '../actions/actions'
import ProfileInfo from '../controls/ProfileInfo'

class ProfilePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = props.userInfo
	}

	render(){
      return (<div id="profile-page">
        <Menu active="profile" settings={this.settings} userInfo={this.userInfo}/>
        <br/><br/>
        <ProfileInfo userInfo={this.userInfo}/>
        <div className="container">
          <ChangePasswordCard/>
        </div>
      </div>
      )
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createBiasCheckerAccountFromFB: (settings, userInfo, email, password, guardian, history) => dispatch(createBiasCheckerAccountFromFacebookAsync(settings, userInfo, email, password, guardian, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfilePageUnwrapped))