import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import {Tabs,Tab} from 'material-ui/Tabs'
import FontIcon from 'material-ui/FontIcon';
import UserIdentity from '../model/UserIdentity'
import {connect} from 'react-redux';
import Auth from '../model/Auth'
import {changePage} from '../actions/actions'
import AppBar from 'material-ui/AppBar'

class Menu extends React.Component {
	constructor(props){
		super(props)
		this.settings = props.settings
		this.userInfo = new UserIdentity(Auth.getDecodedJwt())
		this.activeMenu = props.active
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
	}

	handleSearchChange(event){
		//only filter if 4+ characters
		let keyword = event.target.value
		this.pageSearch(keyword, this.settings, this.userInfo)			
	}

	handleActiveTabChange(newActiveTab){
		//TODO: permissions!styling!!showNav!
		switch(newActiveTab.props.index){
			case 0:
				this.changePage(this.active, "stream", this.history)
				break
			case 1:
				this.changePage(this.active, "articles", this.history)
				break
			case 2:
				this.changePage(this.active, "profile", this.history)
				break
			case 3:
				this.changePage(this.active, "ruler", this.history)
				break
		}
	}

	handleTitleTouch(){
		this.changePage(this.active, "/", this.history)
	}
	getCurrentIndex(){
		switch(this.activeMenu){
			case "stream": return 0
			case "articles": return 1
			case "profile": return 2
			case "ruler": return 3
		}
	}

	render(){
		return(<div>
				<AppBar showMenuIconButton={false} title="Curator (0.1.0)" onTitleTouchTap={this.handleTitleTouch} />
				<Tabs initialSelectedIndex={this.getCurrentIndex()}>
					<Tab icon={<FontIcon className="material-icons">view_stream</FontIcon>} onActive={this.handleActiveTabChange} />
					<Tab icon={<FontIcon className="material-icons">list</FontIcon>} onActive={this.handleActiveTabChange}/>
					<Tab icon={<FontIcon className="material-icons">perm_identity</FontIcon>} onActive={this.handleActiveTabChange}/>
					<Tab icon={<FontIcon className="material-icons">supervisor_account</FontIcon>} onActive={this.handleActiveTabChange}/>
				</Tabs>
			</div>
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