import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '../store'
import Menu from '../controls/Menu'
import MemberCardList from '../controls/PhilosopherRuler/MemberCardList'
import {loadMembersForApprovalAsync, addRoleAsync} from '../actions/actions'
import StoreObserver from '../services/StoreObserver'

class MemberManagementPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings;
    this.history = props.history;
    this.addRole = props.addRole;
  }

  selectState(superState){
    return { members:superState.memberList.members, identity: superState.identity.userInfo };
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
    if(self.state.identity !== undefined && self.hasLoaded === undefined && state.members.length == 0){
      self.hasLoaded = true;
      self.props.loadMembersForApproval(self.settings, state.identity);
    }
  }

  render(){
    let state = this.state;
      return (
      <div id="philosopher-ruler-page">
        <Menu active={"ruler"} userInfo={state.identity}/>
        <br/><br/>
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
        <div className="container">
          <MemberCardList members={state.members.members} approve={this.addRole} settings={this.settings} userInfo={state.identity}/>
        </div>
      </div>
      );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMembersForApproval: (settings, userInfo) => dispatch(loadMembersForApprovalAsync(settings, userInfo)),
    addRole: (targetMemberId, targetRoleName, settings, userInfo) =>  { dispatch(addRoleAsync(targetMemberId, targetRoleName, settings, userInfo)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MemberManagementPageUnwrapped))