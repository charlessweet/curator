class Settings{
	constructor(){
		this.biasServiceUrl = process.env.BIAS_SERVER_URL
		this.fbAppId = process.env.FB_APP_ID

		//TODO: move these to the server. however, they're not *that* secret as i'm really not
		//selling anything, and the user is authenticated with server-generated session-only JWT.
		//so in the worst case, someone with these could use this to get past the generic application-level
		//security, which would be really annoying, but won't do any damage
		this.biasCheckerAppId = process.env.BC_APP_ID
		this.biasCheckerSecret = process.env.BC_APP_SECRET
		this.biasCheckerJwtKey = process.env.BC_JWT_KEY
	}
}
export default Settings;