import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraphBar from './BiasGraphBar';

const BiasGraph = (props) => {
	const article = props.article;
	const style = {
		"width":"200px",
		"border":"0.1em solid orange",
		"borderRadius": "0.5em",
		"padding":"0.2em"
	};
	return(
		<div style={style}>
			<BiasGraphBar score={article.algorithmScore} title="Algorithm Score" color="orange"/>
			<BiasGraphBar score={article.personalScore} title="My Score" color="lightgray"/>
			<BiasGraphBar score={article.consensusScore} title="Consensus Score" color="gray"/>
		</div>
	);
}
export default BiasGraph;