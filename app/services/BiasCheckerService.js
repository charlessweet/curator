import Settings from "../model/Settings"
import Auth from '../model/Auth'
import FetchUrl from './FetchUrl'

export default class BiasCheckerService{
	constructor(biasServiceUrl, biasServiceAppId, biasServiceSecret){
		this.biasServiceUrl = biasServiceUrl
		this.biasServiceSecret = biasServiceSecret
		this.biasServiceAppId = biasServiceAppId
	}
	callBiasChecker(relativeUrl, method, data, basicAuth){
		var url  = this.biasServiceUrl + relativeUrl
		var req = {
			method: method,
			mode: "cors",
			headers: {
				"X-BIASCHECKER-API-KEY":this.biasServiceSecret, 
				"X-BIASCHECKER-APP-ID":this.biasServiceAppId, 
				"Content-Type": "application/json",
				"Authorization": "Bearer " + Auth.getJwt()
			}
		}
		if(basicAuth !== undefined){
			req.headers["Authorization"] = basicAuth
		}

		if(data !== undefined){
			req.body = JSON.stringify(data)
		}
		return FetchUrl.executeFetch(url, data, req)
	}

	authenticateFacebook(fbAuthToken, tokenType){
		return this.callBiasChecker("/authenticate/facebook", "POST", fbAuthToken)
	}
	
	makeBasicAuth(user, password) {
		var tok = user + ':' + password
		var hash = btoa(tok)
		return "Basic " + hash
	}

	/**
	...as in I promise I'll give you some JSON :)
	*/
	jsonPromise(biasCheckerPromise){
		return biasCheckerPromise
			.then((response) => {
				return response.json()
			})
	}

	authenticateBasic(username, password){
		let basicAuth = this.makeBasicAuth(username, password)
		return this.jsonPromise(this.callBiasChecker("/authenticate/basic", "POST", undefined, basicAuth))
	}

	loadArticles(memberId){
		var relativeUrl = "/my/articles"
		return this.jsonPromise(this.callBiasChecker(relativeUrl, "GET"))
	}

	loadStream(){
		var relativeUrl = "/articles"
		return this.jsonPromise(this.callBiasChecker(relativeUrl, "GET"))
	}

	createBookmark(article, biasToken){
		var relativeUrl = "/bookmark?biasToken=" + biasToken + "&fullUrl=true"
		return this.callBiasChecker(relativeUrl, "POST", article)
		.then(function(res){
			return res.id//bookmark id
		})
	}

	createBiasCheckerMemberFromFacebook(facebookUserId, biasToken, email, password, guardian){
		let relativeUrl = "/users/" + facebookUserId + "/register?biasToken=" + biasToken
		let body = {}
		body.email = email
		body.password = password
		body.guardian = guardian
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(res){
			return res.memberId
		})
	}
	createAccount(email, password){
		let relativeUrl  = "/register"
		let body = {}
		body.email = email
		body.password = password
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(res){
			return res
		})
	}

	loadMembersForApproval(biasToken){
		let relativeUrl = "/roles/requests"
		return this.callBiasChecker(relativeUrl, "GET")
		.then(function(rows){
//			console.log("BiasCheckerService_loadMembersForApproval",rows)
			return rows
		})
	}

	//for me only
	requestRole(memberId, targetRole){
		let relativeUrl = "/my/roles"
		let body ={}
		body.targetMemberId = memberId
		body.roleName = targetRole
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	approveRole(memberId, targetRole){
		let relativeUrl = "/members/" + memberId + "/roles"
		let body = {}
		body.roleName = targetRole
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	denyRole(targetMemberId, targetRole){
		let relativeUrl = "/roles/" + targetRole + "/requests/" + targetMemberId
		return this.callBiasChecker(relativeUrl, "DELETE", undefined)
		.then(function(result){
			return result
		})		
	}

	changePassword(newPassword){
		let relativeUrl = "/my/password"
		let body = { "password" : newPassword }
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	analyzeArticle(label, link){
		let relativeUrl = "/analyze"
		let body = {}
		body.selfLabel = label
		body.linkToValidate = link
		return this.jsonPromise(this.callBiasChecker(relativeUrl, "POST", body))
	}

	searchMyArticles(keyword, facebookUserId, biasToken){
		let relativeUrl = "/users/" + facebookUserId + "/search?biasToken=" + biasToken + "&keyword=" + keyword
		return this.callBiasChecker(relativeUrl, "GET")
		.then(function(result){
			return result
		})
	}

	critiqueArticle(userName, articleId, paragraphNum, sentenceNum, quote, analysis, errorType, biasToken){
		let relativeUrl = "/articles/" + articleId + "/critique"
		let body = {}
		body.paragraph = paragraphNum
		body.sentence = sentenceNum
		body.critiqueDate = new Date()
		body.quote = quote
		body.analysis = analysis
		body.errorType = errorType
		body.userName = userName
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	linkToFacebook(facebookUserId){
		let relativeUrl = "/my/facebook"
		let body = {}
		body.facebookUserId = facebookUserId
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	loadArticle(articleId){
		let relativeUrl = "/articles/" + articleId
		return this.callBiasChecker(relativeUrl, "GET")
	}
}