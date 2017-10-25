import React from 'react';
import ReactDOM from 'react-dom';
import BoxElement from './BoxElement';

const BoxScore = (props) => {
	const article = props.article;
	const reviewArticle = props.reviewArticle
	let boxStyle = {
		display: 'inline-block'
	}
	return(
		<div>
			<div>
				<div style={boxStyle}>
					<BoxElement article={article} aspect="bias"/>
				</div>
				<div style={boxStyle}>
					<BoxElement article={article} aspect="factual-error" reviewArticle={reviewArticle}/>
				</div>
				<div style={boxStyle}>
					<BoxElement article={article} aspect="logical-error" reviewArticle={reviewArticle}/>
				</div>
			</div>
		</div>
	);
}
export default BoxScore;