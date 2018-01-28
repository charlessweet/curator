import React from 'react'
import PropTypes from 'prop-types'
import ArticleCard from './ArticleCard'
import Article from '../model/Article'
import Settings from '../model/Settings'
import store from '../store'
import Grid from 'material-ui/Grid'

const ArticleCardList = (props) => {
	return (
	<Grid container>
	{
		(props.articles.articles.length > 0 ?
		props.articles.articles.map((afl)=>{
			return <ArticleCard settings={props.settings} reviewArticle={props.reviewArticle} createBookmark={props.createBookmark} key={afl.link} article={afl} fbAppId={props.settings.fbAppId} biasToken={props.userInfo.biasToken}/>
		}) : <Grid item xs={12}>No articles selected</Grid>)
	}
	</Grid>
)}

export default ArticleCardList;
