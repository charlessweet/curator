import Settings from "../model/Settings"

export default class Auth{
	static getDecodedJwt(){
		return this.decodeJwt(this.getJwt())
	}

	static getJwt(){
		if(this.storageKey === undefined){
			this.storageKey = new Settings().biasCheckerJwtKey	
		}
		return localStorage.getItem(this.storageKey)		
	}
	
	static decodeJwt(jwt){
		try{
			if(jwt !== null && jwt !== undefined){
				let parts = jwt.split(".")
				return JSON.parse(atob(parts[1]))
			}else{
				return null//reset if we have a  null jwt
			}			
		}catch(e){
			return null
		}
	}

	static isLoggedIn(){
		try{
			let returnedJwt = this.getJwt()
			if(returnedJwt !== this.biasCheckerJwt){
				this.tokenDecoded = this.decodeJwt(returnedJwt)
			}
			let currentTime = new Date().getTime() / 1000;
			return (this.tokenDecoded !== undefined && this.tokenDecoded !== null && currentTime <= this.tokenDecoded.exp)			
		}catch(e){
			console.log(e)
			return false
		}
	}

	static logout(){
		if(this.storageKey === undefined){
			this.storageKey = new Settings().biasCheckerJwtKey	
		}
		localStorage.removeItem(this.storageKey)
		window.location = '/'
	}
}

