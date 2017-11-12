import actionTypes from '../../app/actionTypes'
import * as actions from '../../app/actions/actions'
import {expect} from 'chai';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'

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
		let history = {
			push: (page) => { 
					if(page != "articles") {
						throw("History push was not /articles.")
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
			type: actionTypes.FAILED,
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

describe('Successful article actions', ()=>{
	let articles = { httpCode: 200, "stuff" : "nonsense" }
	beforeEach(function(done){
		global.fetch = (url,req) => {
			let ret = {}
			ret.json = () => {
				return articles
			}
			return Promise.resolve(ret)
		}
		done()
	}),
	afterEach(function(done){
		delete global.fetch//clean up
		done()
	}),	
	it('loadArticles should emit the correct event', (done)=>{
		let f = actions.loadArticlesAsync({},{})
		f((event) => {
			expect(event).to.eql({
				type: actionTypes.SHOW_ARTICLES,
				id: 7,
				articles: articles
			})
			done()
		})
	})
})