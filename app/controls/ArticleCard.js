import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraph from './BiasGraph';
import TruthLink from './TruthLink';
import ShareLink from './ShareLink';
import BoxScore from './BoxScore/BoxScore'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const ArticleCard = (props) => {
	const article = props.article;
	const fbAppId = props.fbAppId;
	const biasToken = props.biasToken;
	const reviewArticle = props.reviewArticle
	let htmlDecode = (encoded) => {
		var elem = document.createElement('textarea')
		elem.innerHTML = encoded
		var decoded = elem.value
		return decoded
	}
	let keywords = []
	if(article.keywords !== undefined){
		if(!Array.isArray(article.keywords)){
			keywords.push(article.keywords)
		}else{
			keywords = article.keywords
		}
		keywords = keywords.join(", ")
	}else{
		keywords = "No keywords assigned."
	}
	const getShareLink = ()=> { return [<ShareLink key='shareLink' fbappid={fbAppId} 
		biasToken={biasToken} settings={props.settings} article={article} 
		createBookmark={props.createBookmark} />] }
	return (
		<Card>
			<CardHeader
				title={htmlDecode(article.title)}
				actAsExpander={true}
      			showExpandableButton={true}
      			style={{wordWrap: "break-word"}}
			/>
			<CardText expandable={true}> 
				<div style={{wordWrap: "break-word"}}>{article.summary}</div>
				<p><span><a className="grey-text" target="_blank" href={article.link}>Link to Article</a></span></p>
				<div>
					<span className="grey-text darken-5" >KEYWORDS: </span><i className="grey-text">{keywords}</i>
				</div>
			</CardText>
			<CardText>
				<div>
					<BoxScore article={article} reviewArticle={reviewArticle}/>
				</div>
			</CardText>
		</Card>
	);
};
export default ArticleCard;