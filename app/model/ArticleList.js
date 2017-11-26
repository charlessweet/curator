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
		//this is a little weird.  i use the same constructor for an array of formal Articles as an array of objects from the 
		//server.  eventually, I'll want to change this, but this works for now.
		if(art === undefined || art.biasScore !== undefined){
			this.articles = articles.map((a) => new Article(a.id, a.title, (a.description !== undefined && a.description.length > 0 ? a.description : a.data), a.link, a.keywords, 0, a.biasScore, 0, a.critiques, a.outOfContextScore, a.factualErrorScore, a.logicalErrorScore));
		}else{
			this.articles = articles.map((a) => new Article(a.id, a.title, a.summary, a.link, a.keywords, 0, a.algorithmScore, 0, a.critiques, a.outOfContextScore, a.factualErrorScore, a.logicalErrorScore));
		}
		this.length = articles.length;
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
		return this;//so we can chain calls
	}

	overwriteIfExists(article){
		let existingIndex = this.articles.findIndex((a) => a.id == article.id)
		if(existingIndex > -1){
			this.articles[existingIndex] = article
		}
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