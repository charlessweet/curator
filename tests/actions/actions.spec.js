import actionTypes from '../../app/actionTypes'
import * as actions from '../../app/actions/actions'
import {expect} from 'chai';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import FetchUrl, {FetchUrlInstance} from '../../app/services/FetchUrl'
import Settings from '../../app/model/Settings'
import BiasCheckerService from '../../app/services/BiasCheckerService'

const settings = new Settings()

let  createMockBiasChecker = (method, rootUrl, url, payload) => {
	let fetchUrl = new FetchUrlInstance()
	fetchUrl.stageCall(rootUrl + url, payload, method)
	return new BiasCheckerService(rootUrl, "bias_checker_key", "bias_chekcer_value", fetchUrl)	
}

before(function(done){
	global.fetch = (url,req) => {
		return new Promise((resolve, reject) => {
			reject({"error": "default fetch called - usually means your matching url is not consistent with what the BiasCheckerService method calls"})
			done()
		})
	}
	global.dispatch = (action) => {
		return { "action": action }
		done()
	}
	done()
})

after(function(done){
	delete global.fetch//clean up
	delete global.dispatch
	done()
})

//NOTE: EINVAL error is specific to windows 10
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var store = {}
if (!global.localStorage) {
  global.localStorage = {
    getItem(key) { return store[key] },
    setItem(key,value) { store[key] = value }
  }
}

//decode base64
global.atob = (x) => {
	return new Buffer(x, "base64").toString("ascii")
}

//encode base64
global.btoa = (x) => {
	return new Buffer(x).toString("base64")
}

describe('Navigation actions', ()=>{
	it('indicatePageWasLoaded should emit the correct event', ()=>{
		let page = "fakePage" + guid()
		expect(actions.indicatePageWasLoaded(page)).to.eql({
			type: actionTypes.SET_PAGE,
			id: 0,
			currentPage: page
		})
	}),
	it('changePage should push correct page to history', ()=>{
		let toPage = "articles"
		let fromPage = "profile"
		let slash = false;
		let history = {
			push: (page) => { 
					if(!slash){
						slash = (page == "/")
					}else if(page != "articles") {
						throw("History push was " + page + " (not /articles as expected).")
					}
				}
		}
		actions.changePage(fromPage, toPage, history);
	}),
	it('changePage should emit the correct event', ()=>{
		let toPage = "articles"
		let fromPage = "profile"
		let slash = false;
		let history = {
			push: (page) => {}
		}
		expect(actions.changePage(fromPage, toPage, history)).to.eql({
			type: actionTypes.CHANGE_PAGE,
			id: 6,
			fromPage: fromPage,
			toPage: toPage
		})
	})
})


describe('Login actions', ()=>{
	describe('loginJwt', () => {	
		it('loginJwt should fail on an invalid jwt', ()=>{
			let fakeJwt = guid()
			expect(actions.loginJwt(fakeJwt)).to.eql({
				type: actionTypes.LOGIN_FAILED,
				id: 16,
				error: {
					message: "Invalid client-side JWT"
				}
			})
		}),
		it('loginJwt should parse a valid JWT correctly', ()=>{
			let realJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJndWFyZGlhbiIsInBoaWxvc29waGVyLXJ1bGVyIl0sIm5hbWUiOiJjaHVjay5zd2VldEBnbWFpbC5jb20iLCJtZW1iZXJJZCI6IlpPTUNqVVpxNFdobng2VUpRWnV0NHV4WEpKOW9lWjZnWHozcEF1ekh2bUxuUU5uSjhWa2NhYVJwOVBwdTdMdTIiLCJ1c2VySWQiOiIwZjFlNTMzMDBjYTQ5ZWZmYTkwZDRlNDI3MjhjMmY2OWE4MzYzOWM4YWM5YWU0YzE3OTZiZjg2OTliM2E1OGExIiwiaWF0IjoxNTEwMTE4ODkwLCJleHAiOjE1MTAxMjk0NDUsImlzcyI6InVybjpjdXJhdG9yLmJpYXNjaGVrZXIub3JnIn0.OTBfY14wbw3FUc9civ0Cu1k7Tyha62-fs8VC72RkgF8"
			expect(actions.loginJwt(realJwt)).to.eql({
				"id": 15,
				"memberId": "ZOMCjUZq4Whnx6UJQZut4uxXJJ9oeZ6gXz3pAuzHvmLnQNnJ8VkcaaRp9Ppu7Lu2",
				"roles": [
					"guardian",
					"philosopher-ruler"],
				"type": "LOGIN",
				"userId": "0f1e53300ca49effa90d4e42728c2f69a83639c8ac9ae4c1796bf8699b3a58a1",
				"userName": "chuck.sweet@gmail.com"
	      	})		
		})
	})

	describe('loginBasicAsync', () => {	
		it('loginBasicAsync should emit the correct event when fails', (done)=>{
			let email = "chuck.sweet@gmail.com"
			let password = "fail-nopassword"
			let alwaysFails = new Promise((resolve, reject) =>{
				reject({"message":"failed the promise"})
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "login_basic_async_fail", "/authenticate/basic")
			let f = actions.loginBasicAsync(email, password, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'FAIL', 
					id: 16, 
					error: { message: 'failed the promise' }
				}
				expect(actual).to.eql(expected)
				done()
			})
		}),
		it('loginBasicAsync should emit the correct event when successful', (done)=>{
			let email = "chuck.sweet@gmail.com"
			let password = "nopassword"
			let realJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJndWFyZGlhbiIsInBoaWxvc29waGVyLXJ1bGVyIl0sIm5hbWUiOiJjaHVjay5zd2VldEBnbWFpbC5jb20iLCJtZW1iZXJJZCI6IlpPTUNqVVpxNFdobng2VUpRWnV0NHV4WEpKOW9lWjZnWHozcEF1ekh2bUxuUU5uSjhWa2NhYVJwOVBwdTdMdTIiLCJ1c2VySWQiOiIwZjFlNTMzMDBjYTQ5ZWZmYTkwZDRlNDI3MjhjMmY2OWE4MzYzOWM4YWM5YWU0YzE3OTZiZjg2OTliM2E1OGExIiwiaWF0IjoxNTEwMTE4ODkwLCJleHAiOjE1MTAxMjk0NDUsImlzcyI6InVybjpjdXJhdG9yLmJpYXNjaGVrZXIub3JnIn0.OTBfY14wbw3FUc9civ0Cu1k7Tyha62-fs8VC72RkgF8"		
			let alwaysSucceeds = new Promise((resolve, reject) =>{
				let ret = {}
				ret.json = () => { return realJwt }
				resolve(ret)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "login_basic_async", "/authenticate/basic")
			let f = actions.loginBasicAsync(email, password, mockBiasChecker)
			f((actual) => {
				let expected = {
					"id": 15,
					"memberId": "ZOMCjUZq4Whnx6UJQZut4uxXJJ9oeZ6gXz3pAuzHvmLnQNnJ8VkcaaRp9Ppu7Lu2",
					"roles": [
						"guardian",
						"philosopher-ruler"],
					"type": "LOGIN",
					"userId": "0f1e53300ca49effa90d4e42728c2f69a83639c8ac9ae4c1796bf8699b3a58a1",
					"userName": "chuck.sweet@gmail.com"
		      	}
				expect(actual).to.eql(expected)
				done()
			})
		})
	})
})

describe('Article actions', () => {
	describe('loadArticlesAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ articleId: 1 }] //testing 
			let alwaysSucceeds = new Promise((resolve, reject) => {
				let ret = {}
				ret.json = () => {return articles}
				resolve(ret)
			})	
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "load_articles_async", "/my/articles")
			let f = actions.loadArticlesAsync(settings, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'SHOW_ARTICLES',
					id: 7, 
					articles: [ { articleId: 1 } ]
				}
				expect(expected).to.eql(actual)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let alwaysFails = new Promise((resolve, reject) => {
				reject({"message":"failed the promise"})
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "load_articles_async_fail", "/my/articles")
			let f = actions.loadArticlesAsync(settings, mockBiasChecker)
			let expected = {
				type: 'FAIL', 
				id: 16, 
				error: { message: 'failed the promise' }
			}			
			f((actual)=>{
				expect(expected).to.eql(actual)
				done()
			})
		})
	})

	describe('loadStreamAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ articleId: 1 }] //testing 
			let alwaysSucceeds = new Promise((resolve, reject) => {
				let ret = {}
				ret.json = () => {return articles}
				resolve(ret)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "load_stream_async", "/articles")
			let f = actions.loadStreamAsync(settings, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'SHOW_STREAM', 
					id: 11, 
					articles: [ { articleId: 1 } ]
				}
				expect(actual).to.eql(expected)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let alwaysFails = new Promise((resolve, reject) => {
				reject({"message":"failed the promise"})
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "load_stream_async_fail", "/articles")
			let f = actions.loadStreamAsync(settings, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'FAIL', 
					id: 16, 
					error: { message: 'failed the promise' }
				}
				expect(actual).to.eql(expected)
				done()
			})
		})
	})	
	describe('reviewArticleAsync', ()=>{
		let history = {
			push: (target) => { }
		}
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ id: 1 }] //testing 
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(articles[0])
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "review_article_async", "/articles/" + articles[0].id)
			let f = actions.reviewArticleAsync(articles[0].id, history, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'REVIEW_ARTICLE', 
					id: 12, 
					article: articles[0]
				})
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let articles = [{ id: 4 }] //testing 
			let error = {"message":"failed the promise"}
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "review_article_async_fail", "/articles/" + articles[0].id)
			let f = actions.reviewArticleAsync(articles[0].id, history, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})
	})

	describe('loadRoleRequestsAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let members = [{ id: 1 }]
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(members)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  "/roles/requests")
			let f = actions.loadRoleRequestsAsync(mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'LOAD_ROLE_REQUESTS', 
					id: 5, 
					members: members
				})
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  "/roles/requests")
			let f = actions.loadRoleRequestsAsync(mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})
	})

	describe('addRoleAsync', () => {
		it('should emit the correct event when successful', (done)=>{
			let members = [{ id: 1 }]
			let targetMemberId = 1
			let targetRoleId = "hushpuppie"
			let relativeUrl = "/members/" + targetMemberId + "/roles"
			let body ={}
			body.roleName = targetRoleId
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(members)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  relativeUrl, body)
			let f = actions.addRoleAsync(targetMemberId, targetRoleId, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'GRANT_PROMOTION_REQUEST', 
					id: 8,
					grantInfo: members
				})
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let targetMemberId = 1
			let targetRoleId = "hushpuppie"
			let relativeUrl = "/members/" + targetMemberId + "/roles"
			let body ={}
			body.roleName = targetRoleId
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  relativeUrl, body)
			let f = actions.addRoleAsync(targetMemberId, targetRoleId, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})
	})

	describe('analyzeArticleAsync', () => {
		it('should emit the correct event when successful', (done)=>{
			let article = { id: 1 }
			let label = 'analyze_article_test'
			let link = 'http://nosuchlink'
			let body = {}
			body.selfLabel = label
			body.linkToValidate = link

			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(article)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  "/analyze", body)
			let f = actions.analyzeArticleAsync(label, link, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'ANALYZE_ARTICLE', 
					id: 9, 
					article: article
				}
				expect(expected).to.eql(actual)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let article = { id: 1 }
			let label = 'analyze_article_test'
			let link = 'http://nosuchlink'
			let body = {}
			body.selfLabel = label
			body.linkToValidate = link
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  "/analyze", body)
			let f = actions.analyzeArticleAsync(label, link, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})	
	})

	describe('searchForMyArticleAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ id: 1 }]
			let keyword = 'keyword_search_test'
			let keywordValid = true
			let relativeUrl = "/my/articles/search?keyword=" + keyword
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(articles)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test", relativeUrl)
			let f = actions.searchForMyArticleAsync(keyword, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'MY_ARTICLE_KEYWORD_SEARCH', 
					id: 10,
					keywordWasValid:  keywordValid,
					matchingArticles: articles
				}
				expect(expected).to.eql(actual)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let articles = [{ id: 1 }]
			let keyword = 'keyword_search_test'
			let keywordValid = true
			let relativeUrl = "/my/articles/search?keyword=" + keyword
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test", relativeUrl)
			let f = actions.searchForMyArticleAsync(keyword, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})			
	})
	describe('critiqueArticleAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articleWithCritique = { id: 1 }
			let articleId = 1
			let errorType = "not-a-real-error"
			let analysis = "something, something, about the article"
			let quotation = "some quote which backs this up"
			let paragraphIndex = 42
			let sentenceIndex = 7
			let relativeUrl = "/articles/" + articleId + "/critique"
			let body = {}
			body.paragraph = paragraphIndex
			body.sentence = sentenceIndex
			body.critiqueDate = new Date()
			body.quote = quotation
			body.analysis = analysis
			body.errorType = errorType

			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(articleWithCritique)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test", relativeUrl, body)
			let f = actions.critiqueArticleAsync(articleId, errorType, analysis, quotation, paragraphIndex, sentenceIndex, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'ADD_ARTICLE_CRITIQUE', 
					id: 14,
					article: articleWithCritique
				}
				expect(actual).to.eql(expected)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let articleWithCritique = { id: 1 }
			let articleId = 1
			let errorType = "not-a-real-error"
			let analysis = "something, something, about the article"
			let quotation = "some quote which backs this up"
			let paragraphIndex = 42
			let sentenceIndex = 7
			let relativeUrl = "/articles/" + articleId + "/critique"
			let body = {}
			body.paragraph = paragraphIndex
			body.sentence = sentenceIndex
			body.critiqueDate = new Date()
			body.quote = quotation
			body.analysis = analysis
			body.errorType = errorType

			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test", relativeUrl, body)
			let f = actions.critiqueArticleAsync(articleId, errorType, analysis, quotation, paragraphIndex, sentenceIndex, mockBiasChecker)
			f((event)=>{
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})	
	})
})

describe('Account Management actions', () => {	
	describe('changePasswordAsync', () => {
		it('should emit the correct event when successful', (done)=>{
			let passwordInfo = { id: 1 }
			let relativeUrl = "/my/password"
			let newPassword = "notapassword"
			let body = { "password" : newPassword }
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(passwordInfo)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  relativeUrl, body)
			let f = actions.changePasswordAsync(newPassword, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'CHANGE_PASSWORD', 
					id: 15, 
					result: passwordInfo
				}
				expect(actual).to.eql(expected)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let passwordInfo = { id: 1 }
			let relativeUrl = "/my/password"
			let newPassword = "notapassword"
			let body = { "password" : newPassword }
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  relativeUrl, body)
			let f = actions.changePasswordAsync(newPassword, mockBiasChecker)
			f((event)=>{
				//console.log(event)
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})
	})

	describe('createAccountAsync', () => {
		it('should emit the correct event when successful', (done)=>{
			let passwordInfo = { id: 1 }
			let email = "nosuchaccount@biaschecker.org"
			let relativeUrl = "/register"
			let password = "notapassword"
			let body = {}
			body.email = email
			body.password = password
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(passwordInfo)
				}catch(e){
					reject(e)
				}
			})
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  relativeUrl, body)
			let f = actions.createAccountAsync(email, password, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'CREATE_MEMBER', 
					id: 17, 
					result: passwordInfo
				}
				expect(expected).to.eql(actual)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let relativeUrl = "/register"
			let password = "notapassword"
			let email = "nosuchaccount@biaschecker.org"
			let body = {}
			body.email = email
			body.password = password
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  relativeUrl, body)
			let f = actions.createAccountAsync(email, password, mockBiasChecker)
			f((event)=>{
				//console.log(event)
				expect(event).to.eql({
					type: 'FAIL', 
					id: 16, 
					error: error
				})
				done()
			})
		})
	})

	describe('requestRoleAsync', () => {
		it('should emit the correct event when successful', (done)=>{
			let payload = { id: 1 }
			let alwaysSucceeds = new Promise((resolve, reject) => {
				try{
					resolve(payload)
				}catch(e){
					reject(e)
				}
			})
			let relativeUrl = "/my/roles"
			let memberId = 1
			let targetRole = "fakerole"
			let body ={}
			body.targetMemberId = memberId
			body.roleName = targetRole
			let mockBiasChecker = createMockBiasChecker(alwaysSucceeds, "test",  relativeUrl, body)
			let f = actions.requestRoleAsync(memberId, targetRole, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'REQUEST_ROLE', 
					id: 18, 
					result: payload
				}
				expect(expected).to.eql(actual)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let error = {"message":"failed the promise"}
			let alwaysFails = new Promise((resolve, reject) => {
				reject(error)
			})
			let payload = { id: 1 }
			let relativeUrl = "/my/roles"
			let memberId = 1
			let targetRole = "fakerole"
			let body ={}
			body.targetMemberId = memberId
			body.roleName = targetRole
			let mockBiasChecker = createMockBiasChecker(alwaysFails, "test",  relativeUrl, body)
			let f = actions.requestRoleAsync(memberId, targetRole, mockBiasChecker)
			f((actual)=>{
				let expected = {
					type: 'FAIL', 
					id: 16, 
					error: error
				}
				expect(expected).to.eql(actual)
				done()
			})
		})
	})	
})	