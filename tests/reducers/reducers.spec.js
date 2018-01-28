import actionTypes from '../../app/actionTypes'
import * as reducers from '../../app/reducers/reducers'
import {expect} from 'chai';
import sinon from 'sinon'
import MemberList from '../../app/model/MemberList'

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

describe('Reducers', () => {
	describe('Article reducers', ()=>{
		let domainArticle = { 
			id: "be64140edc2a4132ae8ccf366dd008d3", 
			title: "One Flew Over", 
			algorithmScore: 0.444, 
			link:"https://no.such.link.com/oneflewover",
			consensusScore: 0.23,
			critiques: [],
			keywords: [],
			logicalErrorScore: 0.432,
			outOfContextScore: 0.665,
			factualErrorScore: 0.778,
			personalScore:0.443,
			summary: "Article about jack nicholson"
		}
		let databaseArticle = { 
			id: "be64140edc2a4132ae8ccf366dd008d3", 
			title: "One Flew Over", 
			biasScore: 0.444, 
			link:"https://no.such.link.com/oneflewover",
			consensusScore: 0.23,
			critiques: [],
			keywords: [],
			logicalErrorScore: 0.432,
			outOfContextScore: 0.665,
			factualErrorScore: 0.778,
			personalScore:0.443,
			description: "Article about jack nicholson"
		}	
		it('undefined action should return correct default state',()=>{
			let ns = reducers.articleList()
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(expected).to.eql(ns)
		}),
		it(actionTypes.SHOW_ARTICLES + ' action without articles should return default state', () => {
			let ns = reducers.articleList(undefined, { type: actionTypes.SHOW_ARTICLES, articles: []})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(expected).to.eql(ns)
		}),
		it(actionTypes.SHOW_ARTICLES + ' action with invalid article should return default state', () => {
			let ns = reducers.articleList(undefined, { type: actionTypes.SHOW_ARTICLES, articles: [ { title: "this is a test" } ]})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(expected).to.eql(ns)
		}),
		it(actionTypes.SHOW_ARTICLES + ' action with database article should return correct domain article in state', () => {
			let articles = [ databaseArticle ]

			let actual = reducers.articleList(undefined, { type: actionTypes.SHOW_ARTICLES, articles: articles})
			let expected =       {
		        "articles": {
		          "articles": [domainArticle],
		          "length": 1
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.SHOW_ARTICLES + ' action with domain article should return correct domain article in state', () => {
			let articles = [ domainArticle ]

			let actual = reducers.articleList(undefined, { type: actionTypes.SHOW_ARTICLES, articles: articles})
			let expected =       {
		        "articles": {
		          "articles": [domainArticle],
		          "length": 1
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.ANALYZE_ARTICLE + ' action should append article if it does not exist', () => {
			let articles = [ domainArticle ]
			let actual = reducers.articleList(undefined, { type: actionTypes.ANALYZE_ARTICLE, article: databaseArticle})
			let expected =       {
		        "articles": {
		          "articles": [domainArticle],
		          "length": 1
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(actual).to.eql(expected)
		}),	
		it(actionTypes.ANALYZE_ARTICLE + ' action should not append article if it exists already', () => {
			let articles = { articles: [ domainArticle ], length:1}
			let initialState = {
				articles: articles,
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
			}
			let actual = reducers.articleList(initialState, { type: actionTypes.ANALYZE_ARTICLE, article: databaseArticle})
			let expected =  initialState
			expect(actual).to.eql(expected)
		})	,
		it(actionTypes.SHOW_STREAM + ' action without articles should return default state', () => {
			let ns = reducers.articleList(undefined, { type: actionTypes.SHOW_STREAM, articles: []})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(expected).to.eql(ns)
		}),
		it(actionTypes.SHOW_STREAM + ' action with invalid article should return default state', () => {
			let ns = reducers.articleList(undefined, { type: actionTypes.SHOW_STREAM, articles: [ { title: "this is a test" } ]})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
		      }
			expect(expected).to.eql(ns)
		}),
		it(actionTypes.SHOW_STREAM + ' action with database article should return correct domain article in state', () => {
			let articles = [ databaseArticle ]

			let actual = reducers.articleList(undefined, { type: actionTypes.SHOW_STREAM, articles: articles})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [domainArticle],
		          "length": 1
		        }
		      }
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.REVIEW_ARTICLE + " action should show article in currentArticle property", ()=>{
			let actual = reducers.articleList(undefined, { type: actionTypes.REVIEW_ARTICLE, article: domainArticle})
			let expected =       {
		        "articles": {
		          "articles": [],
		          "length": 0
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        },
		        "currentArticle": domainArticle
		    }
		    expect(actual).to.eql(expected)
		}),
		it(actionTypes.ADD_ARTICLE_CRITIQUE + " action should add article to currentArticle and update article in state", ()=>{
			let articles = { articles: [ domainArticle ], length:1}
			let initialState = {
				articles: articles,
		        "stream": {
		          "articles": [],
		          "length": 0
		        }
			}
			let ldarticle = Object.assign({}, domainArticle)
			ldarticle.critiques = ["this should be a critique"]
			let actual = reducers.articleList(initialState, { type: actionTypes.ADD_ARTICLE_CRITIQUE, article: ldarticle})
			let expected =       {
		        "articles": {
		          "articles": [ldarticle],
		          "length": 1
		        },
		        "stream": {
		          "articles": [],
		          "length": 0
		        },
		        "currentArticle": ldarticle
		    }
		    expect(actual).to.eql(expected)
		})
	})

	describe('Login and Setting reducers', ()=>{
		it("settings reducer should add settings object to state", ()=>{
			//type doesn't matter
			let actual = reducers.settings(undefined, { type: actionTypes.REVIEW_ARTICLE })
			let expected = {
				"biasCheckerAppId": "0909367047e24c43956ae4511cb28f00",
				"biasCheckerJwtKey": "JWT_882cbdece34b456580decc7a88b3caa1",
				"biasCheckerSecret": "0e4f843becb044e496a317f3befc5105",
				"biasServiceUrl": "http://devserver:3000",
				"fbAppId": "382449245425765"
			}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.LOGIN + " action should add UserIdentity to state", ()=>{
			let action = {
				type: actionTypes.LOGIN,
				userId: "USER_ID",
				memberId: "MEMBER_ID",
				userName: "USER_NAME",
				"roles": ["ROLES"]
			}
			let actual = reducers.identity(undefined, action)
		
			let expected = {
				"userInfo": {
					"memberId": "MEMBER_ID",
		      		"roles": [
		      			"ROLES"
		      		],
		      		"userId": "USER_ID",
		      		"userName": "USER_NAME"
	      		}
			}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.RESET_PASSWORD_REQUEST + " action should add passwordResetRequestId to state", ()=>{
			let action = {
				type: actionTypes.RESET_PASSWORD_REQUEST,
				id: 24,
				passwordResetRequestId: "PASSWORD_RESET_REQUEST_ID"
			}
			let actual = reducers.identity(undefined,action)
			let expected = {
				"passwordResetRequestId": "PASSWORD_RESET_REQUEST_ID"
			}
			expect(actual).to.eql(expected)
		})
	})

	describe('Member reducers', ()=>{
		let dateCalculated = new Date('December 17, 1995 03:24:00')
		let memberId = guid()
		let members = [
			{
				memberId: memberId,
				requestDate: dateCalculated,
				requestor: "Deliverance Tails Fleet",
				roleName: "guardian",
				email: "deliverance.tails.fleet@gmail.com"
			}
		]
		let action = {
			grantInfo:{
				grantMemberId: memberId,
				roleName: "guardian"
			}
		}
		it(actionTypes.LOAD_ROLE_REQUESTS + " action should add members to state", () =>{
			let actual = reducers.memberList(undefined, { type: actionTypes.LOAD_ROLE_REQUESTS, members: members})
			let expected = {
				"members": {
					"length": 1,
					"members": [{
					    "email": "deliverance.tails.fleet@gmail.com",
					    "memberId": memberId,
					    "requestDate": dateCalculated,
					    "requestor": "Deliverance Tails Fleet",
					    "roleName": "guardian",
					}]
				}
			}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.GRANT_PROMOTION_REQUEST + " action should remove promotion request from list", ()=>{
			action.type=actionTypes.GRANT_PROMOTION_REQUEST
			let actual = reducers.memberList({members:new MemberList(members)}, action)
			let expected = {
				members:{
					length:0,
					members:[]
				}
			}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.DENY_PROMOTION_REQUEST + " action should remove promotion request from list", ()=>{
			action.type=actionTypes.DENY_PROMOTION_REQUEST
			let actual = reducers.memberList({members:new MemberList(members)}, action)
			let expected = {
				members:{
					length:0,
					members:[]
				}
			}
			expect(actual).to.eql(expected)
		})		
	})

	describe('Page reducers', ()=>{
		it(actionTypes.SET_PAGE + " action should add current page to state", ()=>{
			let action = { type: actionTypes.SET_PAGE, currentPage: "myFakePage"}
			let actual = reducers.page(undefined, action)
			let expected = { current: "myFakePage"}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.CHANGE_PAGE + " action should add to and from page to state", ()=>{
			let action = { type: actionTypes.CHANGE_PAGE, fromPage: "myFakeFromPage", toPage: "myFakeToPage"}
			let actual = reducers.page(undefined, action)
			let expected = { current:"myFakeToPage", transitioningFrom: "myFakeFromPage", transitioningTo: "myFakeToPage"}
			expect(actual).to.eql(expected)
		})		
	})

	describe('Failure reducers', ()=>{
		it(actionTypes.FAILED + " action should add failure to state", ()=>{
			let action = { type: actionTypes.FAILED, error: "myError"}
			let actual = reducers.failure(undefined, action)
			let expected = { error: "myError"}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.CLEAR_ERROR + " action should clear the preceding error", ()=>{
			let action = { type: actionTypes.CLEAR_ERROR }
			let actual = reducers.failure({error:"myError"}, action)
			let expected = {}
			expect(actual).to.eql(expected)
		})
	})
	describe('Notification reducers', ()=>{
		it(actionTypes.CREATE_MEMBER + " action should add newAccountCreated state", ()=>{
			let action = { type: actionTypes.CREATE_MEMBER }
			let actual = reducers.notify(undefined, action)
			let expected = { newAccountCreated: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.LOGIN_FAILED + " action should add loginFailed state", ()=>{
			let action = { type: actionTypes.LOGIN_FAILED }
			let actual = reducers.notify(undefined, action)
			let expected = { loginFailed: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.LINK_TO_FACEBOOK + " action should add existingLinksImported state", ()=>{
			let action = { type: actionTypes.LINK_TO_FACEBOOK }
			let actual = reducers.notify(undefined, action)
			let expected = { existingLinksImported: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.REQUEST_ROLE + " action should add roleRequested state", ()=>{
			let action = { type: actionTypes.REQUEST_ROLE }
			let actual = reducers.notify(undefined, action)
			let expected = { roleRequested: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.FAILED + " action should add roleRequested state", ()=>{
			let action = { type: actionTypes.FAILED }
			let actual = reducers.notify(undefined, action)
			let expected = { failed: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.CHANGE_PASSWORD + " action should add passwordChanged state", ()=>{
			let action = { type: actionTypes.CHANGE_PASSWORD }
			let actual = reducers.notify(undefined, action)
			let expected = { passwordChanged: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.RESET_PASSWORD_REQUEST + " action should resetRequestSucceeded state", ()=>{
			let action = { type: actionTypes.RESET_PASSWORD_REQUEST }
			let actual = reducers.notify(undefined, action)
			let expected = { resetRequestSucceeded: true}
			expect(actual).to.eql(expected)
		}),
		it(actionTypes.CLEAR_NOTIFY_USER + " action should clear passwordChanged state", ()=>{
			let action = { type: actionTypes.CLEAR_NOTIFY_USER, triggerState:"passwordChanged" }
			let state = { passwordChanged: true }
			let actual = reducers.notify(state, action)
			let expected = {}
			expect(actual).to.eql(expected)
		})
	})
})
