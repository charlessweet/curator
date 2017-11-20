import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraph from './BiasGraph';
import TruthLink from './TruthLink';
import ShareLink from './ShareLink';
import BoxScore from './BoxScore/BoxScore'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List'
import ArticleReviewModal from './ArticleReviewModal'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

const ReviewDetailsCard = (props) => {
	const article = props.article;
	let id = 0
	console.log(article)
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
            <ArticleReviewModal articleId={article.id} />
            <br/><br/>
            <Divider />
          	<List>
              {
                (article.critiques !== undefined ? 
                	article.critiques.map((c) => { return <ListItem key={id++} primaryText={<div>
                      	<p className="secondary-content chip">{c.errorType}</p>
                      	<p>&quot;{c.quote}&quot;</p>
                      	<p><i>{c.analysis}</i></p>
                      	<p><br/>(near paragraph {c.paragraph}, sentence {c.sentence})</p>
                      	<Divider/>
                      </div>} />}) : 
                	<ListItem primaryText="No critiques found."/>)
              }
            </List>        
          </CardText>
          <CardActions>
            <a target="_blank" href={article.link}>Display Article In Separate Tab</a>
          </CardActions>
        </Card>
	);
};
export default ReviewDetailsCard;