import React from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router'
import Button from 'material-ui/Button'
import Card,{CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'

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
			this.analyzeArticle("None", data.url)			
		}
	}

	validate(){
		return this.state
	}
	render() {
		return <div className="container">
			<Card>
				<CardContent>
	                <Typography type="headline" component="h4">
	                  {this.userInfo.userName}, what article would you like analyzed?
	                </Typography>
					<input type="url" name="url" placeholder="http://www.biaschecker.org" onChange={this.handleInputChange}></input>
					<Button title="Analyze article" className='primary' onClick={this.handleSubmit}>Analyze Article</Button>
				</CardContent>
			</Card>
		</div>
	}
}
export default withRouter(ArticlePost);