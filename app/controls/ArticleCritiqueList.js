import React from 'react'
import PropTypes from 'prop-types'
import ArticleCard from './ArticleCard'
import Article from '../model/Article'
import Settings from '../model/Settings'
import store from '../store'
import Card, {CardContent} from 'material-ui/Card'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'
import Typography from 'material-ui/Typography'

const ArticleCritiqueList = (props) => {
	let userInfo = new UserIdentity(Auth.getDecodedJwt())
	let hashCode = (str) => { // java String#hashCode
    	var hash = 0
    	for (var i = 0; i < str.length; i++) {
       		hash = str.charCodeAt(i) + ((hash << 5) - hash);
    	}
    	return hash;
	} 

	let intToRGB = (i) => {
    	var c = (i & 0x00FFFFFF)
	        .toString(16)
        	.toUpperCase()
    	return "00000".substring(0, 6 - c.length) + c;
	}
	let i = 0
	let getAvatarStyle = (critique) => {
		return { backgroundColor: "#" + intToRGB(hashCode("" + critique.userName)) }
	}
//	console.log("ArticleCritiqueList", props.critiques)
	return (
	<Grid container>
		<Grid item xs={12}>Displaying {(props.critiques !== undefined ? props.critiques.length : 0)} critiques.</Grid>
		{
			(props.critiques !== undefined ? 
				props.critiques.map((critique)=>{
					//console.log(critique)
					return <Grid item xs={12} md={3} key={i++}><Card>
								<CardContent>
									<Avatar style={getAvatarStyle(critique)}>C</Avatar>
									<Divider/>
									<Typography component="h4">
										{critique.errorType}
									</Typography>
									<Divider/><br/>
									<Typography component="p">
										{critique.analysis}
									</Typography>
								</CardContent>
								<CardContent>
									<font size="small">{critique.critiqueDate}</font>
								</CardContent>
							</Card></Grid>
				}) : <Grid item>{"No analyses exist for this article."}</Grid>)
		}
	</Grid>
)}

export default ArticleCritiqueList;
