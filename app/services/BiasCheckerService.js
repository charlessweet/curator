import Settings from '../model/Settings'
export default class BiasCheckerService{
	constructor(biasServiceUrl, biasServiceAppId, biasServiceSecret){
		this.biasServiceUrl = biasServiceUrl;
		this.biasServiceSecret = biasServiceSecret;
		this.biasServiceAppId = biasServiceAppId;

		var settings = new Settings()
		this.biasServiceUrl = settings.biasServiceUrl
	}
	callBiasChecker(relativeUrl, method, data){
		var url  = this.biasServiceUrl + relativeUrl;
		var req = {
			method: method,
			mode: "cors",
			headers: {"X-BIASCHECKER-API-KEY":this.biasServiceSecret, "X-BIASCHECKER-APP-ID":this.biasServiceAppId, 'Content-Type': 'application/json'}
		};
		if(data !== undefined){
			req.body = JSON.stringify(data);
		}
		return fetch(url, req)
		.then(function(res){
			return res.json();
		})
		.catch(function(err){
			throw "BiasChecker service call failed for " + relativeUrl + ".  Error was: " + err;
		})
	}
	exchangeToken(fbAuthToken, tokenType){
		return this.callBiasChecker("/tokens/exchange/facebook", "POST", fbAuthToken)
			.then(function(res){
				return res;
		})
	}
	
	loadArticles(facebookUserId, biasToken){
		var relativeUrl = "/users/facebook/" + facebookUserId + "/articles?biasToken=" + biasToken;
		return this.callBiasChecker(relativeUrl, "GET")
	}

	loadStream(biasToken){
		var relativeUrl = "/articles?biasToken=" + biasToken;
		return this.callBiasChecker(relativeUrl, "GET")
	}

	createBookmark(article, biasToken){
		var relativeUrl = "/bookmark?biasToken=" + biasToken + "&fullUrl=true";
		return this.callBiasChecker(relativeUrl, "POST", article)
		.then(function(res){
			return res.id;//bookmark id
		})
	}
	createBiasCheckerMemberFromFacebook(facebookUserId, biasToken, email, password, guardian){
		let relativeUrl = "/users/" + facebookUserId + "/register?biasToken=" + biasToken;
		let body = {};
		body.email = email;
		body.password = password;
		body.guardian = guardian;
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(res){
			return res.memberId;
		})
	}
	loadMembersForApproval(biasToken){
		let relativeUrl = "/members/promotions/pending?biasToken=" + biasToken;
		return this.callBiasChecker(relativeUrl, "GET")
		.then(function(rows){
			console.log("BiasCheckerService_loadMembersForApproval",rows);
			return rows;
		})
	}

	addRole(memberId, targetRole, biasToken){
		let relativeUrl = "/members/promotions/pending?biasToken=" + biasToken
		let body ={}
		body.targetMemberId = memberId
		body.targetRole = targetRole
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result;
		})
	}

	analyzeArticle(label, link, biasToken){
		let relativeUrl = "/analyze?biasToken=" + biasToken;
		let body = {}
		body.selfLabel = label
		body.linkToValidate = link
		console.log(body)
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}

	searchMyArticles(keyword, facebookUserId, biasToken){
		let relativeUrl = "/users/" + facebookUserId + "/search?biasToken=" + biasToken + "&keyword=" + keyword
		return this.callBiasChecker(relativeUrl, "GET")
		.then(function(result){
			return result
		})
	}

	critiqueArticle(articleId, paragraphNum, sentenceNum, quote, analysis, errorType, biasToken){
		let relativeUrl = "/articles/" + articleId + "/critique?biasToken=" + biasToken
		let body = {}
		body.paragraph = paragraphNum
		body.sentence = sentenceNum
		body.critiqueDate = new Date()
		body.quote = quote
		body.analysis = analysis
		body.errorType = errorType
		return this.callBiasChecker(relativeUrl, "POST", body)
		.then(function(result){
			return result
		})
	}
}