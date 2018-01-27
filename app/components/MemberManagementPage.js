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
import Grid from 'material-ui/Grid'
import Card, {CardContent} from 'material-ui/Card'

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
      self.props.loadMembersForApproval();
    }
  }

  render(){
      let state = this.state;   
      //console.log("manstate", state)   
      return (
      <Grid container>
          <Grid item xs={12} md={12} style={{"padding":"0px"}}>
            <Menu active="ruler" settings={this.settings} userInfo={this.userInfo}/>
          </Grid>
          <Grid item xs={12}>
          <div className="container">
            <Card>
              <CardContent>
                  <Typography type="headline" component="h4">
                    Member Management
                  </Typography>
                  <Typography component="p">
                    Approve or disapprove of user requests.
                  </Typography>
              </CardContent>
            </Card>
          </div>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {(this.userInfo.roles !== undefined && this.userInfo.roles.indexOf("philosopher-ruler") > -1 ? 
                <div>
                  <MemberCardList members={state.members} approve={this.addRole} deny={this.denyRole} settings={this.settings} userInfo={state.identity}/>
                </div>
                : <div className="container">If you were an Administrator, you would see a list  of people to approve. But, you're not. Soon, we will allow  people to do that
                so check back!</div>)}
              </CardContent>
            </Card>
          </Grid>
      </Grid>)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadMembersForApproval: () => dispatch(loadRoleRequestsAsync()),
    addRole: (targetMemberId, targetRoleName) =>  { dispatch(addRoleAsync(targetMemberId, targetRoleName)) },
    denyRole: (targetMemberId, targetRoleName) =>  { dispatch(denyRoleAsync(targetMemberId, targetRoleName)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings:state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MemberManagementPageUnwrapped))