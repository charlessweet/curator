import React from 'react';
import ReactDOM from 'react-dom';
import StoreObserver from '../services/StoreObserver'
import store from '../store'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { changePage, clearError } from '../actions/actions'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'

class AuthController extends React.Component{
	constructor(props){
		super(props);
    this.userInfo = new UserIdentity(Auth.getDecodedJwt())
    this.changePage = props.changePage
    this.history = props.history 
    this.clearError = props.clearError  
	}
  
  selectState(superState){
    return { 
      error: superState.failure.error
    }
  }

  areEqual(subStateA, subStateB){
    let evaluated = subStateA.error === subStateB.error
    return evaluated
  }

  componentWillMount(){
    let localState = this.selectState(store.getState())
    this.loadComponent(this, localState)
  }

  componentDidMount(){
    this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.areEqual)
  }

  componentWillUnmount(){
    this.observer.unsubscribe();
  }

  loadComponent(self, state){
    self.setState(state);
    if(state.error !== undefined){
      if(state.error.httpCode === 401){
        self.clearError()
        self.changePage("stream", "", self.history)
      }
    }    
  }

	render(){
      return (<span/>);
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changePage: (fromPage, toPage, history) => dispatch(changePage(fromPage, toPage, history)),
    clearError: () => dispatch(clearError())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthController))