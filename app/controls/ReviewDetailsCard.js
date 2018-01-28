import React from 'react';
import ReactDOM from 'react-dom';
import BiasGraph from './BiasGraph';
import TruthLink from './TruthLink';
import ShareLink from './ShareLink';
import BoxScore from './BoxScore/BoxScore'
import Card, {CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import ArticleReviewModal from './ArticleReviewModal'
import Divider from 'material-ui/Divider'
import ArticleCritiqueAddLink from './ArticleCritiqueAddLink'
import ArticleCritiqueList from './ArticleCritiqueList'
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'

const ReviewDetailsCard = (props) => {
	const article = props.article;
	let id = 0
  let htmlDecode = (encoded) => {
    var elem = document.createElement('textarea')
    elem.innerHTML = encoded
    var decoded = elem.value
    return decoded
  }
  let prevenBreakout = {
    overflowWrap: "break-word",
      wordWrap: "break-word",
      wordBreak: "break-word",
      hyphens:"auto"
  }
	return (
		<Card>
      <CardContent>
        <ExpansionPanel elevation={0}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography type="headline" component="h4">
              {htmlDecode(article.title)}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={prevenBreakout}>
            {(article.data !== undefined ? article.data : "No summary provided.")}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        </CardContent>
        <CardContent>
          <ArticleCritiqueList critiques={article.critiques} />
          <ArticleCritiqueAddLink article={article} />
        </CardContent>
    </Card>
	);
};
export default ReviewDetailsCard;