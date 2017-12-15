import {expect} from 'chai';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import FetchUrl from '../../app/services/FetchUrl'

describe('FetchUrl actions', ()=>{
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

	it('serviceCall replacement works', ()=>{
		let called = false
		let serviceCallMethod = () => {
			called = true
		}
		let url = 'http://fakeurl'
		let payload = {'payload_is_fake_too':"doesn't matter"}
		FetchUrl.stageCall(url, payload, serviceCallMethod)
		FetchUrl.executeFetch(url, payload)
		expect(called).to.eql(true)
	})
})
