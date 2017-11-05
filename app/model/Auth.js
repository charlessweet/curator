
import Settings from "../model/Settings"

export default class Auth{
	static decodeJwt(jwt){
		if(jwt !== null){
			let parts = jwt.split(".")
			return JSON.parse(atob(parts[1]))
		}else{
			return null//reset if we have a  null jwt
		}
	}

	static isLoggedIn(){
		if(this.storageKey === undefined){
			this.storageKey = new Settings().biasCheckerJwtKey	
		}
		let returnedJwt = localStorage.getItem(this.storageKey)
		if(returnedJwt !== this.biasCheckerJwt){
			this.tokenDecoded = this.decodeJwt(returnedJwt)
		}
		let currentTime = new Date().getTime() / 1000;
		return (this.tokenDecoded !== undefined && this.tokenDecoded !== null && currentTime <= this.tokenDecoded.exp)
	}
}

