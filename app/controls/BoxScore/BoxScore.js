import React from 'react';
import ReactDOM from 'react-dom';
import BoxElement from './BoxElement';
import Auth from '../../model/Auth'
import UserIdentity from '../../model/UserIdentity'

const BoxScore = (props) => {
	const article = props.article;
	const userInfo = new UserIdentity(Auth.getDecodedJwt())
	const reviewArticle = (userInfo.roles !== undefined && userInfo.roles !== null && userInfo.roles.indexOf("guardian")>-1 ?
		props.reviewArticle : null)
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