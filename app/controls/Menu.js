import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import Tabs, {Tab} from 'material-ui/Tabs'
import Icon from 'material-ui/Icon';
import UserIdentity from '../model/UserIdentity'
import {connect} from 'react-redux';
import Auth from '../model/Auth'
import {changePage} from '../actions/actions'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import appLogo from '../images/app-logo.png'

class Menu extends React.Component {
	constructor(props){
		super(props)
		this.settings = props.settings
		this.userInfo = new UserIdentity(Auth.getDecodedJwt())
		this.showNav = (props.showNav === undefined ? true : props.showNav)
		this.history = props.history
		this.changePage = props.changePage
		this.handleActiveTabChange = this.handleActiveTabChange.bind(this);	
		this.handleTitleTouch = this.handleTitleTouch.bind(this);
		this.rulerStyle = {
			display: (this.userInfo === undefined || this.userInfo.roles ===  undefined || this.userInfo.roles.find((x) => { return x === "philosopher-ruler"}) === undefined ? "none" : "block")
		}
		this.pageSearch = undefined;//props.pageSearch
		this.handleSearchChange = this.handleSearchChange.bind(this)
		this.state = {"activeMenu":props.active}
	}

	handleSearchChange(event){
		//only filter if 4+ characters
		let keyword = event.target.value
		this.pageSearch(keyword, this.settings, this.userInfo)			
	}

	handleActiveTabChange(event, value){
		this.changePage(this.active, value, this.history)
	}

	handleTitleTouch(){
		this.changePage(this.active, "/", this.history)
	}

	render(){
	    let socialStyle = {
	      "color":"white",
	      "fontSize": "1.2em"
	    }
	    let iStyle = {
	      "color":"ivory"
	    }
	    let curator = {
      		"fontFamily" : "'IM Fell English', serif"
	    }
		return(<AppBar position="static">
          			<Toolbar>
            			<span style={curator}>Curator</span>
          			</Toolbar>
					<Tabs value={this.state.activeMenu} onChange={this.handleActiveTabChange}>
						<Tab icon={<Icon className="material-icons">view_stream</Icon>} value="stream" />
						<Tab icon={<Icon className="material-icons">list</Icon>} value="articles"/>
						<Tab icon={<Icon className="material-icons">perm_identity</Icon>} value="profile"/>
						<Tab icon={<Icon className="material-icons">supervisor_account</Icon>} value="ruler"/>
					</Tabs>
          		</AppBar>
	)}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      changePage: (currentPage, targetPage, history) => { dispatch(changePage(currentPage, targetPage, history)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu))