import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraph from './BiasGraph';
import TruthLink from './TruthLink';
import ShareLink from './ShareLink';
import BoxScore from './BoxScore/BoxScore'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import ArticleReviewModal from './ArticleReviewModal'
import Divider from 'material-ui/Divider'
import ArticleCritiqueAddLink from './ArticleCritiqueAddLink'
import ArticleCritiqueList from './ArticleCritiqueList'

const ReviewDetailsCard = (props) => {
	const article = props.article;
	let id = 0
	return (
		<Card>
          <CardHeader
            title={article.title}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}> 
          	{article.summary}
          </CardText>
          <CardText >
          </CardText>
          <CardActions>
            <ArticleCritiqueList critiques={article.critiques} />
            <ArticleCritiqueAddLink article={article} />
          </CardActions>
        </Card>
	);
};
export default ReviewDetailsCard;