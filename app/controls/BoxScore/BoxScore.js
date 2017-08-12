import React from 'react';
import ReactDOM from 'react-dom';
import BoxElement from './BoxElement';

const BoxScore = (props) => {
	const article = props.article;
	const reviewArticle = props.reviewArticle
	let boxStyle = {
		"paddingLeft":"40px"
	}
	return(
		<div>
			<div className="row">
				<div className="col s3" style={boxStyle}>
					<BoxElement article={article} aspect="bias"/>
				</div>
				<div className="col s3" style={boxStyle}>
					<BoxElement article={article} aspect="out-of-context" reviewArticle={reviewArticle}/>
				</div>
				<div className="col s3" style={boxStyle}>
					<BoxElement article={article} aspect="factual-error" reviewArticle={reviewArticle}/>
				</div>
				<div className="col s3" style={boxStyle}>
					<BoxElement article={article} aspect="logical-error" reviewArticle={reviewArticle}/>
				</div>
			</div>
		</div>
	);
}
export default BoxScore;