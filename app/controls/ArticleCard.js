import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraph from './BiasGraph';
import TruthLink from './TruthLink';
import ShareLink from './ShareLink';
import BoxScore from './BoxScore/BoxScore'

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

	return (
		<div className="s12 m6">
			<div className="card">
				<div className="card-content">
					<span className="card-title">{htmlDecode(article.title)}</span>
					<p><span className="grey-text darken-5">LINK TO ARTICLE: </span><span><a className="grey-text" target="_blank" href={article.link}>{article.link}</a></span></p>
					<p>{article.summary}</p>
					<div>
						<br/>
						<BoxScore article={article} reviewArticle={reviewArticle}/>
					</div>
					<div>
						<span className="grey-text darken-5" >KEYWORDS: </span><i className="grey-text">{keywords}</i>
					</div>
				</div>
				<div className="card-action">
					<ShareLink fbappid={fbAppId} biasToken={biasToken} settings={props.settings}
						article={article} createBookmark={props.createBookmark} />
				</div>
			</div>
		</div>
	);
};
export default ArticleCard;