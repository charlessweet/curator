import React from 'react';
import ReactDOM from 'react-dom';

const ShareLink = (props) => {
	const biasToken = props.biasToken;
	const articleId = props.id;
	function shareOnFacebook(e){
		//make bookmark
		props.createBookmark(props.settings, props.article, props.biasToken);
	};
	return (
		<i className="material-icons" onClick={shareOnFacebook}>share</i>
	);
};
export default ShareLink;