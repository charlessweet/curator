import React from 'react'
import PropTypes from 'prop-types'
import Settings from '../model/Settings'
import Snackbar from 'material-ui/Snackbar'
import store from '../store'
import StoreObserver from '../services/StoreObserver'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {clearUserNotification, notifyUser} from '../actions/actions'

class UserNotification extends React.Component{
	constructor(props){
		super(props)
		this.handleRequestClose = this.handleRequestClose.bind(this)
		this.selectState = this.selectState.bind(this)
		this.triggerGroup = props.triggerGroup
		this.triggerState = props.triggerState //state which causes the message to show
		this.message = props.message
		this.clearMessage = props.clearMessage
		this.closeAction = props.closeAction
	}

	selectState(superState){
		//console.log(superState)
		return { 
		  open:(superState[this.triggerGroup] !== undefined && superState[this.triggerGroup][this.triggerState] !== undefined && superState[this.triggerGroup][this.triggerState])
		}
	}

	compareState(subStateA, subStateB){
		return false
	}

	componentWillMount(){
		let localState = this.selectState(store.getState())
		this.loadComponent(this, localState)
	}

	componentDidMount(){
		this.observer = new StoreObserver(this, store, this.selectState, this.loadComponent, this.compareState)
	}

	componentWillUnmount(){
		this.observer.unsubscribe();
	}

	loadComponent(self, state){
		self.setState(state);
	}

	handleRequestClose(event) {
		this.setState({"open":false})
		this.clearMessage(this.triggerGroup, this.triggerState)
		if(this.closeAction !== undefined){
			this.closeAction()			
		}
	}

	render(){
		//console.log(this.state.open)
        return <Snackbar
          open={this.state.open}
          message={this.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
	}
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearMessage:(triggerGroup, triggerState) => dispatch(clearUserNotification(triggerGroup, triggerState))
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserNotification))