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

	copyFromData(articleFromDatabase){
		this.id = articleFromDatabase.id
		this.title = articleFromDatabase.title
		this.summary = articleFromDatabase.data
		this.created = articleFromDatabase.created
		this.link = articleFromDatabase.link
		this.keywords = articleFromDatabase.keywords
		this.personalScore = (articleFromDatabase.personalScore !== undefined ? articleFromDatabase.personalScore : 0)
		this.algorithmScore = articleFromDatabase.biasScore
		this.consensusScore = (articleFromDatabase.consensusScore !== undefined ? articleFromDatabase.consensusScore : 0)
		this.critiques = (articleFromDatabase.critiques !== undefined ? articleFromDatabase.critiques : [])
		this.outOfContextScore = articleFromDatabase.outOfContextScore
		this.factualErrorScore = articleFromDatabase.factualErrorScore
		this.logicalErrorScore = articleFromDatabase.logicalErrorScore
	}
}
export default Article;