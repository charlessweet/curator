import React from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router'
import {PropTypes} from 'prop-types'
import store from '../store'

class Registration extends React.Component{
	constructor(props){
		super(props);
		this.createBiasCheckerAccount = props.createAccount;
		this.state = {};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.history = props.history;
		this.emailRegex = /^\S+@\S+\.\S+$/;
		this.validation = {};
    	store.subscribe(()=>{this.loadComponent(this)}); //call when changes happen to store		
	}

	handleInputChange(event){
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({[name]: value});
	}

	handleSubmit(event){
		this.validation = this.validate();
		if(!this.validation.email && !this.validation.password){
			let storeState = store.getState();
			this.createBiasCheckerAccount(storeState.settings, storeState.identity.userInfo, this.state.email, this.state.password, this.state.guardian, this.history);			
		}else{
			alert("The form is invalid.");
		}
	}

	handleCancel(event){
		this.history.push("/articles");
	}

	validate(){
		return {
			email: this.state.email === undefined && !this.emailRegex.test(this.state.email),
			password: this.state.password === undefined,
			guardian: this.state.guardian === undefined
		}
	}

	loadComponent(registration){
		let state = store.getState();
		if(state.identity.userInfo !== undefined && state.identity.userInfo.memberId !== undefined){
			//this.history.push("/articles");//skip to articles
		}		
	}
	render(){
		return 	<div className="container">
				<h4>Become a BiasChecker Member</h4>
				<p>
				We noticed you don't have a BiasChecker account!  That's fine by us, but there are many benefits to having a BiasChecker account
				in addition to your Facebook login, including gaining access to the social network features of BiasChecker. You also must be a BiasChecker
				account holder to become a Guardian and rate articles (and users) for truthfulness of posts.
				</p>
				<form className="col s12">
					<div className="row">
				        <div className="input-field col s12">
				          <input name="email" type="email" required className="validate" onChange={this.handleInputChange}></input>
				          <label htmlFor="email" data-error="Email address invalid.">Email (This will be your user name.)</label>
				        </div>
				        <div className="input-field col s12">
				          <input name="password" type="password" required className="validate" onChange={this.handleInputChange}></input>
				          <label htmlFor="password">Password</label>
				        </div>	  	
				        <div className="input-field col s12">
				          <input name="guardian" type="checkbox" onChange={this.handleInputChange}></input>
				          <label htmlFor="guardian">I am interested in becoming a Guardian. If you check this, we will be
				          in touch to follow up with some questions to start the vetting process.</label>
				        </div>	  	
				        <div className="input-field col s12 white-text">
				        	<br/>
				          <button id="create_member" type="button" onClick={this.handleSubmit} className="btn-large waves-effect waves-light indigo lighten-1">Create Member Account</button>&nbsp;&nbsp;
				          <button id="cancel" type="button" onClick={this.handleCancel} className="orange btn-large waves-effect waves-light indigo lighten-1">Skip for Now</button>
				        </div>	  	
				    </div>
		  		</form>
		  	</div>			
	}
}

export default withRouter(Registration);