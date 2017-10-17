import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'
import Registration from '../controls/Registration'
import {createBiasCheckerAccountFromFacebookAsync} from '../actions/actions'

class ProfilePageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = props.userInfo
	}

	render(){
      return (<div id="profile-page">
        <Menu active="profile" settings={this.settings} userInfo={this.userInfo}/>
        <br/> <br/>
        <Registration createAccount={this.props.createBiasCheckerAccountFromFB}/>
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