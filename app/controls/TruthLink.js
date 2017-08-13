import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

const TruthLink = (props) => {
	const biasToken = props.biasToken;
	const articleId = props.article.id;
	function rateAndExplain(e){
		//make bookmark
		props.createBookmark(props.settings, props.article, props.biasToken);
	};
	return (
		<Link to={"/truth/" + articleId } className="right truth_link">Rate True or False</Link>
	);
};
export default TruthLink;