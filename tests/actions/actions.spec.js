import actionTypes from '../../app/actionTypes'
import * as actions from '../../app/actions/actions'
import {expect} from 'chai';

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
					if(page != "/articles") {
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