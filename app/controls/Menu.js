import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

class Menu extends React.Component {
	constructor(props){
		super(props)
		this.settings = props.settings
		this.userInfo = props.userInfo
		this.activeMenu = props.active
		this.showNav = (props.showNav === undefined ? true : props.showNav)
		this.rulerStyle = {
			display: (this.userInfo.roles.find((x) => { return x === "philosopher-ruler"}) === undefined ? "none" : "block")
		}
		this.pageSearch = props.pageSearch
		this.handleSearchChange = this.handleSearchChange.bind(this)
	}

	handleSearchChange(event){
		//only filter if 4+ characters
		let keyword = event.target.value
		this.pageSearch(keyword, this.settings, this.userInfo)			
	}

	render(){
		return( <div className="navbar-extended navbar-fixed">
		  	<nav className="indigo darken-4">
		  		<div className="nav-wrapper">
			  		<a href="#" className="brand-logo left">Curator</a><br/><i>Socializing news analysis</i>
			  		{
			  			(this.pageSearch !== undefined ? <div className="input-field right">
					  			<input id="search" type="search" placeholder="keyword search" required onInput={this.handleSearchChange}></input>
					  			<label className="label-icon" htmlFor="search"><i className="material-icons right">search</i></label>
					  			<i className="material-icons">close</i>
							</div>			  				
			  			:
			  				<div/>)
			  		}
		  		</div>
		  		{
		  		(this.showNav ? 
					<ul className="tabs tabs-transparent indigo darken-4">
						<li className={"tab " + (this.activeMenu == "stream" ? "active" : "")}><Link title="View all articles in BiasChecker" to="/stream"><i className="active large material-icons">view_stream</i></Link></li>
						<li className={"tab " + (this.activeMenu == "articles" ? "active" : "")}><Link title="Review articles I have analyzed" to="/articles"><i className="active large material-icons">list</i></Link></li>
						<li className={"tab " + (this.activeMenu == "profile" ? "active" : "")}><Link title="View or edit my profile" to="/profile"><i className="large material-icons">perm_identity</i></Link></li>
						<li style={this.rulerStyle} className={"tab " + (this.activeMenu == "ruler" ? "active" : "")}><Link title="Approve permissions for other users" to="/ruler"><i className="large material-icons">supervisor_account</i></Link></li>
						<li className={"tab " + (this.activeMenu == "about" ? "active" : "")}><Link title="Learn about what makes BiasChecker different" to="/about"><i className="large material-icons">info</i></Link></li>
						<li className={"tab " + (this.activeMenu == "test" ? "active" : "")}><Link title="TESTING" to="/test"><i className="large material-icons">warning</i></Link></li>
					</ul>
					: <div/>)
		  		}
	  		</nav>
		</div>
	)}
}

export default withRouter(Menu);