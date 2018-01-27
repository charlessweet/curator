import Article from './Article'

export default class ArticleList{
	constructor(articles){
		if(articles.articles !== undefined){
			articles = articles.articles
		}
		if(articles.length === 0){
			this.length = 0
			this.articles = []
			return
		}
		let art = articles[0];
		this.articles = articles.filter(a => this.isValidArticle(a)).map((a) => this.createArticle(a))
		this.length = this.articles.length
	}
	
	isValidArticle(a){
		return (a.id !== undefined && a.title !== undefined && a.link !== undefined)
	}

	createArticle(a){
		if((a.description !== undefined || a.data !== undefined) && a.summary === undefined){
			if(a.description !== undefined && a.description.length > 0){
				a.summary = a.description
			}else{
				a.summary = a.data
			}
		}
		if(a.summary === undefined){
			a.summary = "No summary available for article."
		}
		if(a.algorithmScore === undefined){
			a.algorithmScore = a.biasScore
		}
		if(a.consensusScore === undefined){
			a.consensusScore = 0
		}
		if(a.personalScore === undefined){
			a.personalScore = 0
		}
		return new Article(a.id, a.title, a.summary, a.link, a.keywords, a.personalScore, a.algorithmScore, a.consensusScore, a.critiques, a.outOfContextScore, a.factualErrorScore, a.logicalErrorScore)
	}

	equals(otherList){
		if(otherList.length !== this.length){
			return false;
		}

		let sortedKeysA = this.articles.map((a) => {return a.id}).sort()
		let sortedKeysB = otherList.articles.map((a) => {return a.id}).sort()
		for(var i = 0; i < sortedKeysA.length; i++){
			if(sortedKeysA[i] !== sortedKeysB[i])
				return false
		}
		return true;
	}

	addIfNotExists(article){
		if(this.articles.find((a) => a.id == article.id) === undefined){
			this.articles.unshift(article)
		}
		this.length = this.articles.length
		return this;//so we can chain calls
	}

	overwriteIfExists(article){
		let existingIndex = this.articles.findIndex((a) => a.id == article.id)
		if(existingIndex > -1){
			this.articles[existingIndex] = Object.assign({}, article)
		}
		this.length = this.articles.length
		return this
	}

	filter(keyword){
		if(keyword.length > 4){
			let articles = this.articles.find((a) => a.keywords.some((k) => k.includes(keyword)))
			if(articles !== undefined){
				return new ArticleList(articles)
			}
		}
		return this//if nothing matches or changes
	}
}