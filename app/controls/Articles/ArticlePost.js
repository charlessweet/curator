import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router'

class ArticlePost  extends React.Component{	
	constructor(props){
		super(props)
		this.state = {}
		this.userInfo = props.userInfo
		this.settings = props.settings
		this.analyzeArticle = props.analyzeArticle
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInputChange(event){
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name
		this.state[name] = value //todo: why doesn't setState work here?
	}

	handleSubmit(event){
		let data = this.validate()
		if(data.url !== undefined){
			this.analyzeArticle("None", data.url, this.settings, this.userInfo)			
		}
	}

	validate(){
		return this.state
	}
	render() {
		return <div className="container">
			<div className="card">
				<div className="card-content">
					<span className="card-title">{this.userInfo.userName}, what article would you like analyzed?</span>
					<input type="url" name="url" placeholder="http://www.biaschecker.org" onChange={this.handleInputChange}></input>
					<button title="Analyze article" className='btn waves-effect waves-light indigo lighten-1' onClick={this.handleSubmit}>Analyze Article</button>
				</div>
			</div>
		</div>
	}
}
export default withRouter(ArticlePost);