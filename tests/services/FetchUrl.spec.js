import {expect} from 'chai';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import FetchUrl from '../../app/services/FetchUrl'

var shouldResolve = true

before(function(done){
	global.fetch = (url,req) => {
		return new Promise((resolve, reject) => {
			if(shouldResolve){
				resolve({"resolved": "default fetch called"})
			}else{
				reject({"rejected": "default fetch called"})
			}
		})
	}
	done()
})

after(function(done){
	delete global.fetch//clean up
	done()
})

describe('FetchUrl ', ()=>{
	it('actually calls returns staged promise when configured', (done)=>{
		let url = 'http://fakeurl'
		let payload = {'payload_is_fake_too':"doesn't matter"}
		let marshalFakePayload = () => { console.log("doesn't matter") }
		FetchUrl.stageCall(url, payload, marshalFakePayload)
		let f = FetchUrl.executeFetch(url, payload)
		expect(f).to.eql(marshalFakePayload)
		done()
	}),
	it('actually calls returns provided promise when overriden', (done)=>{
		let url = 'http://fakeurl'
		let payload = {'payload_is_fake_too':"doesn't matter"}
		let marshalFakeSecondPayload = () => { console.log("totally does matter") }
		FetchUrl.overrideCall(url, payload, marshalFakeSecondPayload)
		let f = FetchUrl.executeFetch(url, payload)
		expect(f).to.eql(marshalFakeSecondPayload)
		done()
	})
})
