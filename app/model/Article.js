import Karma from './Karma'
class Article{
	constructor(id, title, summary, link, keywords, personalScore, algorithmScore, consensusScore, critiques, outOfContextScore, factualErrorScore, logicalErrorScore){
		this.id = id;
		this.title = title;
		this.summary = summary;
		this.link = link;
		this.keywords = keywords;
		this.personalScore = personalScore;
		this.algorithmScore = algorithmScore;
		this.consensusScore = consensusScore;
		this.critiques = critiques
		this.outOfContextScore = outOfContextScore
		this.factualErrorScore = factualErrorScore
		this.logicalErrorScore = logicalErrorScore
	}
}
export default Article;