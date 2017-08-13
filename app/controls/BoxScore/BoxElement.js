import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom'

const BoxElement = (props) => {
	let reviewArticle = props.reviewArticle
	let determineFeatures = (article, aspect) => {
		//console.log(article)
		let featInfo = {};
		switch(aspect){
			case "bias":
				featInfo.abbreviation = "Bi"
				featInfo.name = "bias"
				featInfo.weight = (article.algorithmScore == undefined ? "0.000" : article.algorithmScore)
				featInfo.active = true;
			break;
			case "out-of-context":
				featInfo.abbreviation = "Cx"
				featInfo.name = "out of context"
				featInfo.weight = (article.outOfContextScore === undefined ? "N/A" : article.outOfContextScore)
				featInfo.active = (featInfo.weight !== "N/A");
			break;
			case "factual-error":
				featInfo.abbreviation = "Fe"
				featInfo.name = "factual error"
				featInfo.weight = (article.factualErrorScore === undefined ? "N/A" : article.factualErrorScore)
				featInfo.active = (featInfo.weight !== "N/A");
			break;
			case "logical-error":
				featInfo.abbreviation = "Le"
				featInfo.name = "logical error"
				featInfo.weight = (article.logicalErrorScore === undefined ? "N/A" : article.logicalErrorScore)
				featInfo.active = (featInfo.weight !== "N/A");
			break;
			case "demo":
				featInfo.abbreviation = "Dm"
				featInfo.name = "demo"
				featInfo.weight = "N/A"
				featInfo.active = true
			break
			default:
				featInfo.abbreviation = "NONE"
				featInfo.name = "Not Recognized"
				featInfo.weight = "N/A"
				featInfo.active = false;
			break;
		}
		return featInfo
	}
	let feature = determineFeatures(props.article, props.aspect);
	let gridStyle = {
		"backgroundColor":"green"
	}
	let elementStyle = {
		"width": "100px",
  		"height": "100px",
  		"fontStyle": "verdana",
  		"textAlign":"center",
  		"padding": "20px 0px 0px 0px",
  		"borderRadius":"3px"
	}
	let weightStyle = {
		"fontFamily": "Verdana",
		"fontSize": "12px"
	}
	let nameStyle = {
		"fontFamily": "Verdana",
		"fontSize": "24px"
	}
	let handleClick = (event) => {
		if(reviewArticle !== undefined){
			reviewArticle(props.article, props.history)
		}
	}
	return(
		<div onClick={handleClick} style={elementStyle} className={(feature.active ? "indigo lighten-4 black-text" : "grey lighten-3 grey-text")}>
			<span style={weightStyle}>{(feature.weight + "").substring(0,6)}</span><br/>
			<span style={nameStyle}>{feature.abbreviation}</span><br/>
			<span style={weightStyle}>{feature.name}</span>
		</div>
	);
}
export default withRouter(BoxElement);