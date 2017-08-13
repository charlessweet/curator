import {actionTypes} from "../actionTypes";
import * as actions from './index';
import {expect} from 'chai';

describe('article actions', ()=>{
	it('showArticles should create a SHOW_ARTICLES action', ()=>{
		expect(actions.showArticles()).to.eql({
			type: actionTypes.SHOW_ARTICLES,
			id: 0
		})
	})
});

describe('article actions', ()=>{
	it('addArticle should create an ADD_ARTICLE action', ()=>{
		let articleLink = "http://www.fakearticlelink.com/12345";
		expect(actions.addArticle(articleLink)).to.eql({
			type: actionTypes.ADD_ARTICLE,
			id: 1,
			link: articleLink
		})
	})
});