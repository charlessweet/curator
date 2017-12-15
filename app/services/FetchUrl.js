var sha256 = require('js-sha256')

/**
This abstraction static is to make it easier to test.
*/
export default class FetchUrl{
	/**
	This executeFetch method allows us to inject service call responses based on the URL + parameter.
	*/
	static executeFetch(url, req){
		let callId = this.generateCallId(url, req)
		this.stageCall(url, req, () => {
			console.log(fetch)
			fetch(url, req)
			.then((res) => {
				return res.json()
			})
			.catch((err) => {
				return "BiasChecker service call failed for " + url + ".  Error was: " + err
			})
		})
		this.makeCall(callId)
	}
	
	static generateCallId(url, req){
		return sha256(url + JSON.stringify(req))
	}
	
	static stageCall(url, req, callback){
		let serviceCallId = this.generateCallId(url, req)
		if(FetchUrl.serviceCalls === undefined){
			FetchUrl.serviceCalls = {}
		}
		if(FetchUrl.serviceCalls[serviceCallId] === undefined){
			FetchUrl.serviceCalls[serviceCallId] = callback	
		}
	}

	static makeCall(serviceCallId){
		let call = this.serviceCalls[serviceCallId]
		if(call !== undefined && call !== null){
			call()
			//we're basically caching - but we don't really want to
			//clear this every time the call is made
			delete this.serviceCalls[serviceCallId]
		}
	}
}