import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import Registration from '../controls/Registration'
import {createBiasCheckerAccountFromFacebookAsync} from '../actions/index'

class RegistrationPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
	}

  render(){
    let state = store.getState();
    return (
    <div id="truth-page">
        <Menu active={"registration"} userInfo={state.identity.userInfo}/>
        <br/><br/><br/>    
      <Registration createAccount={this.props.createBiasCheckerAccountFromFB} />
    </div>
    );
  }

}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createBiasCheckerAccountFromFB: (settings, userInfo, email, password, guardian, history) => dispatch(createBiasCheckerAccountFromFacebookAsync(settings, userInfo, email, password, guardian, history))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    state: state
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegistrationPageUnwrapped))