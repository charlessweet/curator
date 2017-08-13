import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import Menu from '../controls/Menu'

class AboutPageUnwrapped extends React.Component{
	constructor(props){
		super(props);
    this.settings = props.settings
    this.userInfo = props.userInfo
	}
  

	render(){
      return (<div id="bookmark-page">
        <Menu active="about" settings={this.settings} userInfo={this.userInfo}/>
        <br/> <br/>
      </div>
      )
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings,
    userInfo:state.identity.userInfo
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AboutPageUnwrapped))