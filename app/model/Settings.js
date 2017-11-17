class Settings{
	constructor(){
		this.biasServiceUrl = (process.env.BIAS_SERVER_URL || "http://localhost:3000")
		this.fbAppId = (process.env.FB_APP_ID || "382449245425765")
		this.biasCheckerAppId = (process.env.BC_APP_ID || "0909367047e24c43956ae4511cb28f00")
		this.biasCheckerSecret = (process.env.BC_APP_SECRET || "0e4f843becb044e496a317f3befc5105")
		this.biasCheckerJwtKey = (process.env.BC_JWT_KEY || "JWT_882cbdece34b456580decc7a88b3caa1")
	}
}
export default Settings;