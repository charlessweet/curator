import React from 'react'
import PropTypes from 'prop-types'
import ArticleCard from './ArticleCard'
import Article from '../model/Article'
import Settings from '../model/Settings'
import store from '../store'

const ArticleCardList = (props) => {
	console.log(props.articles)
	return (
	<div id="my-posts" className="container">
	<p>Displaying {props.articles.articles.length} articles.</p>
	{
		props.articles.articles.map((afl)=>{
			return <ArticleCard settings={props.settings} reviewArticle={props.reviewArticle} createBookmark={props.createBookmark} key={afl.link} article={afl} fbAppId={props.settings.fbAppId} biasToken={props.userInfo.biasToken}/>
		})
	}
	</div>
)}

export default ArticleCardList;
