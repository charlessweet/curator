import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import MemberCardList from '../controls/PhilosopherRuler/MemberCardList'
import {loadRoleRequestsAsync, addRoleAsync, denyRoleAsync} from '../actions/actions'
import StoreObserver from '../services/StoreObserver'
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'

class MemberManagementPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings;
    this.history = props.history;
    this.addRole = props.addRole;
    this.denyRole = props.denyRole
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
  }

  selectState(superState){
    return { members:superState.memberList.members };
  }

  compareState(subStateA, subStateB){
    let evaluated = subStateA.identity !== undefined
      && subStateB.identity !== undefined
      && subStateA.identity.biasToken !== subStateB.identity.biasToken
      && subStateA.members !== undefined
      && subStateB.members !== undefined
      && subStateA.members.equals(subStateB.members);
    return evaluated
  }

  componentWillMount(){
    this.setState(this.selectState(store.getState()));
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.compareState);
  }

  componentWillUnmount(){
    if(this.observer !== undefined){
      this.observer.unsubscribe();
    }
  }

  loadComponent(self, state){
    self.setState(state);
    if(self.hasLoaded === undefined && state.members.length == 0){
      self.hasLoaded = true;
      self.props.loadMembersForApproval(self.settings, self.userInfo);
    }
  }

  render(){
      let state = this.state;   
//      console.log("manstate", state)   
      return (
      <div id="philosopher-ruler-page">
        <Menu active={"ruler"} />
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Member Management</span>
                    <p>
                    Approve or disapprove of user requests.
                    </p>
                </div>
            </div>
        </div>
        {(this.userInfo.roles !== undefined && this.userInfo.roles.indexOf("philosopher-ruler") > -1 ? 
        <div>
          <MemberCardList members={state.members} approve={this.addRole} deny={this.denyRole} settings={this.settings} userInfo={state.identity}/>
        </div>
        : <div className="container">If you were an Administrator, you would see a list  of people to approve. But, you're not. Soon, we will allow  people to do that
        so check back!</div>)}
      </div>
      );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMembersForApproval: (settings, userInfo) => dispatch(loadRoleRequestsAsync(settings, userInfo)),
    addRole: (targetMemberId, targetRoleName, settings) =>  { dispatch(addRoleAsync(targetMemberId, targetRoleName, settings)) },
    denyRole: (targetMemberId, targetRoleName, settings) =>  { dispatch(denyRoleAsync(targetMemberId, targetRoleName, settings)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MemberManagementPageUnwrapped))