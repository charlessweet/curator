import actionTypes from "../actionTypes"
import pageTypes from "../pageTypes"
import BiasCheckerService from "../services/BiasCheckerService"
import Settings from "../model/Settings"
import Auth from '../model/Auth'

const settings = new Settings()

export const indicatePageWasLoaded = (page) => {
	return{
		type: actionTypes.SET_PAGE,
		id: 0,
		currentPage: page
	}	
}

/**
 * Changes the active component from the current component (specified as fromPage) to the target
 * component (specified as toPage). Aslong as toPage is from pageTypes.js, then this function will
 * transition properly.
 *
 * @param fromPage From the pageTypes enum (pageTypes.js) which indicates the 'from'  component.
 * @param toPage From the pageTypes enum (pageTypes.js) which indicates the 'to' component.
 * @param history Object used to navigate from one page to another (accessible in props usually).
 */
export const changePage = (fromPage, toPage, history) => {
	history.push("/") //reposition at root - hacky, i know
	history.push(toPage)
	return{
		type: actionTypes.CHANGE_PAGE,
		id: 6,
		fromPage: fromPage,
		toPage: toPage
	}
}

export const loginFacebookAsync = (settings, facebookToken) =>{
	//log user in to biaschecker and retrieve biasToken, keep details
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret, localStorage.getItem(settings.biasCheckerJwtKey));
	return function(dispatch) {
		return biasCheckerService.exchangeToken(facebookToken, "FB")
		.then((biasToken)=>{
			dispatch(loginJwt(biasToken));
		})
		.catch((error) => {
			console.log("loginFacebookAsync", error);
		});
	}
};

export const loginBasicAsync = (settings, username, password, targetComponent, history) =>{
	//log user in to biaschecker and retrieve biasToken, keep details
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret, localStorage.getItem(settings.biasCheckerJwtKey));
	return function(dispatch) {
		return biasCheckerService.authenticateBasic(username, password)
		.then((biasToken)=>{
			dispatch(loginJwt(biasToken));
		})
		.catch((error) => {
			console.log("loginBasicAsync", error);
		});
	}
};

export const loginJwt = (jwt) =>{
	//sync jwt in browser with current jwt
	localStorage.setItem(new Settings().biasCheckerJwtKey, jwt)
	let jwtd = Auth.decodeJwt(jwt)
	if(jwtd !== null){
		return {
			type: actionTypes.LOGIN,
			id: 15,
			userName: jwtd.name,
			userId: jwtd.userId,
			memberId: jwtd.memberId,
			roles: jwtd.scope
		}		
	}else{
		return failCall({
			message: "Invalid client-side JWT"
		}, actionTypes.LOGIN_FAILED)
	}
}

const loadArticles = (articles) => {
	return {
		type: actionTypes.SHOW_ARTICLES,
		id: 7,
		articles: articles
	}
};

export const loadArticlesAsync = (settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret, localStorage.getItem(settings.biasCheckerJwtKey));
	return function(dispatch){
		return biasCheckerService.loadArticles()
		.then((data) =>{
			if(!Array.isArray(data)){
				dispatch(failCall(data))
			}else{
				dispatch(loadArticles(data))			
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
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

const loadRoleRequests = (members) => {
//	console.log("loadRoleRequests", members)
	return {
		type: actionTypes.LOAD_ROLE_REQUESTS,
		id: 5,
		members: members
	}
};

export const loadRoleRequestsAsync = (settings, userInfo) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	let biasToken = userInfo.biasToken;
	return function(dispatch){
		return biasCheckerService.loadMembersForApproval(biasToken)
		.then((data) =>{
			if(data.error !== undefined){
				dispatch(failCall(data))
			}else{
				dispatch(loadRoleRequests(data))
			}
		})
		.catch((error) => {
			console.log("loadRoleRequestsAsync", error);
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
	return function(dispatch){
		return biasCheckerService.approveRole(targetMemberId, targetRoleId)
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

const failCall = (error, actionType) => {
//	console.log(error,actionType)
	var action = {
		type: (actionType !== undefined ? actionType : actionTypes.FAILED),
		id: 16,
		error: error
	}
//	console.log(action)
	return action
}

export const analyzeArticleAsync = (label, link, settings, userInfo, history) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret)
	let biasToken = userInfo.biasToken
	return function(dispatch){
		return biasCheckerService.analyzeArticle(label, link, userInfo.biasToken)
		.then((data) => {
			if(data.error !== undefined){
				dispatch(failCall(data))
			}else{
				dispatch(analyzeArticle(data))				
			}
		})
		.catch((error) => {
			console.log("analyzeArticleAsync", error)
			dispatch(failCall(error))
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

export const loadStreamAsync = (settings) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.loadStream()
		.then((data) =>{
			if(!Array.isArray(data)){
				dispatch(failCall(data))
			}else{
				dispatch(loadStream(data))			
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
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

export const reviewArticleAsync = (articleId, history) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.loadArticle(articleId)
		.then((data) =>{
			if(data.error !== undefined){
				dispatch(failCall(data))
			}else{
				dispatch(reviewArticle(data, history))				
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
		})
	}	
}

const critiqueArticle = (articleWithNewCritique) => {
	return {
		type: actionTypes.ADD_ARTICLE_CRITIQUE,
		id: 14,
		article: articleWithNewCritique
	}
}

export const critiqueArticleAsync = (articleId, critique, settings) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.critiqueArticle(critique.userName, articleId, critique.paragraphIndex, critique.sentenceIndex, critique.quote, 
			critique.analysis, critique.errorType)
		.then((articleWithNewCritique) =>{
			dispatch(critiqueArticle(articleWithNewCritique));
		})
		.catch((error) => {
			console.log("critiqueArticleAsync", error);
		})
	}
}

const changePassword = (data) => {
	return {
		type: actionTypes.CHANGE_PASSWORD,
		id:15,
		result: data
	}
}

export const changePasswordAsync = (newPassword, settings) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.changePassword(newPassword)
		.then((data) => {
			if(data.error !== undefined){
				dispatch(failCall(data))
			}else{
				dispatch(changePassword(data))
			}
		})
		.catch((error) => {
			console.log("critiqueArticleAsync", error);
		})
	}
}

const createAccount = (data, email) =>{
	return {
		type:actionTypes.CREATE_MEMBER,
		id: 17,
		result:data
	}
}

export const createAccountAsync = (settings, email, password, history) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.createAccount(email, password)
		.then((data) => {
			if(data.error === undefined){
				dispatch(createAccount(data, email))
			}else{
				dispatch(failCall(data))
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
		})
	}
}

const requestRole = (data) => {
	return {
		type: actionTypes.REQUEST_ROLE,
		id: 18,
		result:data
	}
}

export const requestRoleAsync = (settings, targetMemberId, roleName) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret)
	return function(dispatch){
		return biasCheckerService.requestRole(targetMemberId, roleName)
		.then((data) => {
			if(data.error === undefined){
				dispatch(requestRole(data))
			}else{
				dispatch(failCall(data))
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
		})
	}	
}

const denyRole = (grantInfo) => {
	return {
		type: actionTypes.DENY_PROMOTION_REQUEST,
		id: 19,
		grantInfo: grantInfo
	}
}

export const denyRoleAsync = (targetMemberId, targetRoleId, settings) => {
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret);
	return function(dispatch){
		return biasCheckerService.denyRole(targetMemberId, targetRoleId)
		.then((data) => {
			if(data.error === undefined){
				dispatch(denyRole(data))
			}else{
				dispatch(failCall(data))
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
		})
	}	
}

export const notifyUser = (message) => {
	return {
		type: actionTypes.NOTIFY_USER,
		id: 20,
		message: message
	}
}

export const clearUserNotification = (triggerGroup, triggerState) => {
	return {
		type: actionTypes.CLEAR_NOTIFY_USER,
		id: 21,
		triggerGroup: triggerGroup,
		triggerState: triggerState
	}
}

const linkToFacebook = (data) => {
	return {
		type: actionTypes.LINK_TO_FACEBOOK,
		id: 22,
		data: data
	}
}

export const linkToFacebookAsync = (facebookToken) =>{
	//log user in to biaschecker and retrieve biasToken, keep details
	const biasCheckerService = new BiasCheckerService(settings.biasServiceUrl, settings.biasCheckerAppId, settings.biasCheckerSecret, localStorage.getItem(settings.biasCheckerJwtKey));
	return function(dispatch) {
		return biasCheckerService.linkToFacebook(facebookToken)
		.then((data) => {
			if(data.error === undefined){
				dispatch(linkToFacebook(data))
			}else{
				dispatch(failCall(data))
			}
		})
		.catch((error) => {
			dispatch(failCall(error))
		})
	}
}

export const clearError = () => {
	return {
		type: actionTypes.CLEAR_ERROR,
		id: 23
	}
}