import actionTypes from '../../app/actionTypes'
import * as actions from '../../app/actions/actions'
import {expect} from 'chai';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import FetchUrl from '../../app/services/FetchUrl'
import Settings from '../../app/model/Settings'

var settings = new Settings()

before(function(done){
	global.fetch = (url,req) => {
		return new Promise((resolve, reject) => {
			reject({"error": "default fetch called"})
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
	it('indicatePageWasLoaded should include the name of the page', ()=>{
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
		expect(actions.changePage(fromPage, toPage, history)).to.eql({
			type: actionTypes.CHANGE_PAGE,
			id: 6,
			fromPage: "profile",
			toPage: "articles"
		})
	})
})

describe('Login actions', ()=>{
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

describe('Article actions', () => {
	describe('loadArticlesAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ articleId: 1 }] //testing 
			let alwaysSucceedsLoading = new Promise((resolve, reject) => {
				let ret = {}
				ret.json = () => {return articles}
				resolve(ret)
			})
			FetchUrl.stageCall(settings.biasServiceUrl + "/my/articles", undefined , alwaysSucceedsLoading)
			let f = actions.loadArticlesAsync(settings)
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
			let alwaysFailsLoading = new Promise((resolve, reject) => {
				reject({"message":"failed the promise"})
			})
			FetchUrl.overrideCall(settings.biasServiceUrl + "/my/articles", undefined , alwaysFailsLoading)
			let f = actions.loadArticlesAsync(settings)
			f((actual)=>{
				let expected = {
					type: 'FAIL', 
					id: 16, 
					error: { message: 'failed the promise' }
				}
				expect(expected).to.eql(actual)
				done()
			})
		})
	})
	describe('loadStreamAsync', ()=>{
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ articleId: 1 }] //testing 
			let alwaysSucceedsLoading = new Promise((resolve, reject) => {
				let ret = {}
				ret.json = () => {return articles}
				resolve(ret)
			})
			FetchUrl.stageCall(settings.biasServiceUrl + "/articles", undefined , alwaysSucceedsLoading)
			let f = actions.loadStreamAsync(settings)
			f((actual)=>{
				let expected = {
					type: 'SHOW_STREAM', 
					id: 11, 
					articles: [ { articleId: 1 } ]
				}
				expect(expected).to.eql(expected)
				done()
			})
		}),
		it('should emit the correct event when fails', (done)=>{
			let alwaysFailsLoading = new Promise((resolve, reject) => {
				reject({"message":"failed the promise"})
			})
			FetchUrl.overrideCall(settings.biasServiceUrl + "/articles", undefined , alwaysFailsLoading)
			let f = actions.loadStreamAsync(settings)
			f((actual)=>{
				let expected = {
					type: 'FAIL', 
					id: 16, 
					error: { message: 'failed the promise' }
				}
				expect(expected).to.eql(actual)
				done()
			})
		})
	})	
	describe('reviewArticleAsync', ()=>{
		let history = {
			push: (target) => { }
		}
		let i = 0
		it('should emit the correct event when successful', (done)=>{
			let articles = [{ id: 1 }] //testing 
			let alwaysSucceedsLoading = new Promise((resolve, reject) => {
				try{
					resolve(articles[0])
				}catch(e){
					reject(e)
				}
			})
			FetchUrl.stageCall(settings.biasServiceUrl + "/articles/" + articles[0].id, undefined , alwaysSucceedsLoading)
			let f = actions.reviewArticleAsync(articles[0].id, history)
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
			let alwaysFailsLoading = new Promise((resolve, reject) => {
				reject(error)
			})
			FetchUrl.overrideCall(settings.biasServiceUrl + "/articles/" + articles[0].id, undefined , alwaysFailsLoading)
			let f = actions.reviewArticleAsync(articles[0].id, history)
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
