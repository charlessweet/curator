var sha256 = require('js-sha256')

/**
This abstraction static is to make it easier to test.
*/
export default class FetchUrl{
	/**
	This executeFetch method allows us to inject service call responses based on the URL + parameter.
	*/
	static executeFetch(url, data, req){
		let callId = this.generateCallId(url, data)
		this.stageCall(url, data, fetch(url, req))
		return this.makeCall(callId)
	}
	
	static generateCallId(url, data){
		return sha256(url + JSON.stringify(data))
	}
	
	static stageCall(url, data, callPromise){
		let serviceCallId = this.generateCallId(url, data)
		if(FetchUrl.serviceCalls === undefined){
			FetchUrl.serviceCalls = {}
		}
		if(FetchUrl.serviceCalls[serviceCallId] === undefined){
			FetchUrl.serviceCalls[serviceCallId] = callPromise	
		}
	}

	static overrideCall(url, data, callPromise){
		let serviceCallId = this.generateCallId(url, data)
		if(FetchUrl.serviceCalls === undefined){
			FetchUrl.serviceCalls = {}
		}
		FetchUrl.serviceCalls[serviceCallId] = callPromise
	}

	static makeCall(serviceCallId){
		let call = this.serviceCalls[serviceCallId]
		return call //must be a promise
	}
}