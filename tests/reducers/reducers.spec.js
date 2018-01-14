import actionTypes from '../../app/actionTypes'
import * as reducers from '../../app/reducers/reducers'
import {expect} from 'chai';
import sinon from 'sinon'

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
	})		
})