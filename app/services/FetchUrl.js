var sha256 = require('js-sha256')

export default class FetchUrl{
	static executeFetch(url, data, req){
		return FetchUrl.instance.executeFetch(url, data, req)
	}
	static stageCall(url, data, callPromise){
		FetchUrl.instance.stageCall(url, data, callPromise)
	}
	static overrideCall(url, data, callPromise){
		FetchUrl.instance.overrideCall(url, data, callPromise)
	}
}

export class FetchUrlInstance{
	/**
	This executeFetch method allows us to inject service call responses based on the URL + parameter.
	*/
	executeFetch(url, data, req){
		let callId = this.generateCallId(url, data)
		this.stageCall(url, data, fetch(url, req))
		return this.makeCall(callId)
	}
	
	generateCallId(url, data){
		return sha256(url + JSON.stringify(data))
	}
	
	stageCall(url, data, callPromise){
		let serviceCallId = this.generateCallId(url, data)
		if(this.serviceCalls === undefined){
			this.serviceCalls = {}
		}
		if(this.serviceCalls[serviceCallId] === undefined){
			this.serviceCalls[serviceCallId] = callPromise	
		}
	}

	overrideCall(url, data, callPromise){
		let serviceCallId = this.generateCallId(url, data)
		if(this.serviceCalls === undefined){
			this.serviceCalls = {}
		}
		this.serviceCalls[serviceCallId] = callPromise
	}

	makeCall(serviceCallId){
		let call = this.serviceCalls[serviceCallId]
		delete this.serviceCalls[serviceCallId]
		return call //must be a promise
	}	
}
FetchUrl.instance = new FetchUrlInstance()
