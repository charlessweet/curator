import React from 'react'
import ReactDOM from 'react-dom'
import BiasGraph from './BiasGraph'
import TruthLink from './TruthLink'
import ShareLink from './ShareLink'
import BoxScore from './BoxScore/BoxScore'
import Card, {CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

const ArticleCard = (props) => {
	const article = props.article;
	const fbAppId = props.fbAppId;
	const biasToken = props.biasToken;
	const reviewArticle = props.reviewArticle

	let htmlDecode = (encoded) => {
		var elem = document.createElement('textarea')
		elem.innerHTML = encoded
		var decoded = elem.value
		return decoded
	}
	let keywords = []
	if(article.keywords !== undefined){
		if(!Array.isArray(article.keywords)){
			keywords.push(article.keywords)
		}else{
			keywords = article.keywords
		}
		keywords = keywords.join(", ")
	}else{
		keywords = "No keywords assigned."
	}
	let prevenBreakout = {
		overflowWrap: "break-word",
  		wordWrap: "break-word",
  		wordBreak: "break-word",
  		hyphens:"auto"
	}
	const getShareLink = ()=> { return [<ShareLink key='shareLink' fbappid={fbAppId} 
		biasToken={biasToken} settings={props.settings} article={article} 
		createBookmark={props.createBookmark} />] }
	return (
		<Grid item xs={12} md={4}>
		  <Card style={{"minHeight":393}}>
            <CardContent>
              <ExpansionPanel elevation={0}>
              	<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
		              <Typography type="headline" component="h4">
		                {htmlDecode(article.title)}
		              </Typography>
              	</ExpansionPanelSummary>
              	<ExpansionPanelDetails style={prevenBreakout}>
              		{(article.summary !== undefined ? article.summary : "Processing...")}
              	</ExpansionPanelDetails>
              </ExpansionPanel>
              <div>
				<Button id="reviewArticle" type="button" onClick={()=>{window.open(article.link)}} className="primary">{"View Article at Source"}</Button>
              </div>
              <div>
              	<BoxScore article={article} reviewArticle={reviewArticle}/>
              </div>
              <div className="container">Submitted on {article.created}</div>
            </CardContent>
          </Card>
        </Grid>
	);
};
export default ArticleCard;