import actionTypes from "../actionTypes"
import {pageTypes} from "../actionTypes"
import BiasCheckerService from "../services/BiasCheckerService"
import Settings from "../model/Settings"

export const indicatePageWasLoaded = (page) => {
	return{
		type: actionTypes.SET_PAGE,
		id: 0,
		currentPage: page
	}	
}

export const changePage = (fromPage, toPage, history) => {
	switch(toPage){
		case "articles": 
			history.push("/articles")
			break
		case "stream": 
			history.push("/stream")
			break
		case "profile": 
			history.push("/profile")
			break
	}
	return{
		type: actionTypes.CHANGE_PAGE,
		id: 6,
		fromPage: fromPage,
		toPage: toPage
	}
}

const login = (biasToken, facebookToken) =>{
	localStorage.setItem(new Settings().biasCheckerJwtKey, biasToken.jwt)
	return {
		type: actionTypes.LOGIN,
		id: 2,
		facebookUserId: facebookToken.userID,
		userName: biasToken.name,
		picture: facebookToken.picture,
		biasToken: biasToken.biasAccessToken,
		userId: biasToken.userId,
		memberId: biasToken.memberId,
		roles: biasToken.roles
	};
}

export const loginAsync = (settings, facebookToken) =>{
	//log user in to biaschecker and retrieve biasToken, keep details
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret, localStorage.getItem(settings.biasCheckerJwtKey));
	return function(dispatch) {
		return biasCheckerService.exchangeToken(facebookToken, "FB")
		.then((biasToken)=>{
			dispatch(login(biasToken, facebookToken));
		})
		.catch((error) => {
			console.log("loginAsync", error);
		});
	}
};

const loadArticles = (articles) => {
	return {
		type: actionTypes.SHOW_ARTICLES,
		id: 7,
		articles: articles
	}
};

export const loadArticlesAsync = (settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let userId = userInfo.facebookUserId;
	let biasToken = userInfo.biasToken;
	return function(dispatch){
		return biasCheckerService.loadArticles(userId, biasToken)
		.then((articles) =>{
			dispatch(loadArticles(articles));
		})
		.catch((error) => {
			console.log("loadArticlesAsync", error);
		})
	}
};

const createBookmark = (article, bookmarkId) => {
	return {
		type: actionTypes.CREATE_BOOKMARK,
		id: 3,
		bookmark: { articleId: article.id, bookmarkId: bookmarkId }
	}
}

export const createBookmarkAsync = (settings, article, biasToken) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.createBookmark(article, biasToken)
		.then((bookmarkId) => {
			dispatch(createBookmark(article, bookmarkId));
		})
		.catch((error) => {
			console.log("createBookmarkAsync", error);
		})
	}
}

const createBiasCheckerMemberFromFacebook = (memberId, history) =>{
	if(memberId !== undefined){
		history.push('/register');
	}
	return {
		type:actionTypes.CREATE_MEMBER,
		id: 4,
		memberId: memberId
	}
}

export const createBiasCheckerAccountFromFacebookAsync = (settings, userInfo, email, password, guardian, history) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.createBiasCheckerMemberFromFacebook(userInfo.userId, userInfo.biasToken, email, password, guardian)
		.then((memberId) => {
			dispatch(createBiasCheckerMemberFromFacebook(memberId, history));
		})
		.catch((error) => {
			console.log("createBiasCheckerMemberFromFacebookAsync", error);
		})
	}
}

const loadMembersForApproval = (members) => {
	return {
		type: actionTypes.LOAD_PROMOTION_REQUESTS,
		id: 5,
		members: members
	}
};

export const loadMembersForApprovalAsync = (settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let biasToken = userInfo.biasToken;
	return function(dispatch){
		return biasCheckerService.loadMembersForApproval(biasToken)
		.then((members) =>{
			dispatch(loadMembersForApproval(members));
		})
		.catch((error) => {
			console.log("loadMembersForApprovalAsync", error);
		})
	}
};

const addRole = (grantInfo) => {
	return {
		type: actionTypes.GRANT_PROMOTION_REQUEST,
		id: 8,
		grantInfo: grantInfo
	}
}

export const addRoleAsync = (targetMemberId, targetRoleId, settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let biasToken = userInfo.biasToken
	return function(dispatch){
		return biasCheckerService.addRole(targetMemberId, targetRoleId, biasToken)
		.then((grantInfo) => {
			dispatch(addRole(grantInfo))
		})
		.catch((error) => {
			console.log("addRoleAsync",error)
		})
	}	
}

const analyzeArticle = (article) => {
	return {
		type: actionTypes.ANALYZE_ARTICLE,
		id: 9,
		article: article
	}
}

export const analyzeArticleAsync = (label, link, settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret)
	let biasToken = userInfo.biasToken
	return function(dispatch){
		return biasCheckerService.analyzeArticle(label, link, userInfo.biasToken)
		.then((article) => {
			dispatch(analyzeArticle(article))
		})
		.catch((error) => {
			console.log("analyzeArticleAsync", error)
		})
	}
}

const searchForMyArticle = (keywordWasValid, matchingArticles) => {
	return {
		type:actionTypes.MY_ARTICLE_KEYWORD_SEARCH,
		id: 10,
		keywordWasValid: keywordWasValid,
		matchingArticles: matchingArticles
	}
}

export const searchForMyArticleAsync = (keyword, settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret)
	let biasToken = userInfo.biasToken
	let facebookUserId = userInfo.facebookUserId
	return function(dispatch){
		if(keyword.length > 4){
			return biasCheckerService.searchMyArticles(keyword, facebookUserId, biasToken)
			.then((matchingArticles) => {
				dispatch(searchForMyArticle(true, matchingArticles))
			})
			.catch((error)=>{
				console.log("searchByKeywordAsync",error)
			})			
		}else{
			dispatch(searchForMyArticle(false))
		}
	}
}

const loadStream = (articles) => {
	return {
		type: actionTypes.SHOW_STREAM,
		id: 11,
		articles: articles
	}
};

export const loadStreamAsync = (settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let userId = userInfo.facebookUserId;
	let biasToken = userInfo.biasToken;
	return function(dispatch){
		return biasCheckerService.loadStream(biasToken)
		.then((articles) =>{
			dispatch(loadStream(articles));
		})
		.catch((error) => {
			console.log("loadStreamAsync", error);
		})
	}
}

export const reviewArticle = (article, history) => {
	history.push("/stream/" + article.id)
	return {
		type: actionTypes.REVIEW_ARTICLE,
		id:12,
		article: article
	}
}

const critiqueArticle = (article) => {
	return {
		type: actionTypes.ADD_ARTICLE_CRITIQUE,
		id: 14,
		article: article
	}
}

export const critiqueArticleAsync = (articleId, critique, settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let userId = userInfo.facebookUserId;
	let biasToken = userInfo.biasToken;
	return function(dispatch){
		return biasCheckerService.critiqueArticle(articleId, critique.paragraphIndex, critique.sentenceIndex, critique.quote, 
			critique.analysis, critique.errorType, biasToken)
		.then((article) =>{
			dispatch(critiqueArticle(article));
		})
		.catch((error) => {
			console.log("critiqueArticleAsync", error);
		})
	}
}