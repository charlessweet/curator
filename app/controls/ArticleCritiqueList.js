import React from 'react'
import PropTypes from 'prop-types'
import ArticleCard from './ArticleCard'
import Article from '../model/Article'
import Settings from '../model/Settings'
import store from '../store'
import {List, ListItem} from 'material-ui/List'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import UserIdentity from '../model/UserIdentity'
import Auth from '../model/Auth'

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
	console.log("ArticleCritiqueList", props.critiques)
	return (
	<div id="my-posts" className="container">
	<p>Displaying {(props.critiques !== undefined ? props.critiques.length : 0)} critiques.</p>
	<List>
	{
		(props.critiques !== undefined ? 
			props.critiques.sort((a,b) => {
				if(a.critiqueDate > b.critiqueDate){
					return -1
				}else if(a.critiqueDate < b.critiqueDate){
					return 1
				}else{
					return 0
				}
			}).map((critique)=>{
				return <div key={i++}><Divider /><ListItem 
						leftAvatar={<Avatar style={getAvatarStyle(critique)}>C</Avatar>} 
						primaryText={<span><Chip>{critique.errorType}</Chip><br/>{critique.analysis}</span>}
						secondaryText={<div><font size="small">{critique.critiqueDate}</font></div>}>
					</ListItem></div>
			}) : <span>No analyses exist for this article.</span>)
	}
	</List>
	</div>
)}

export default ArticleCritiqueList;
