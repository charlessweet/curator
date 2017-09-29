class Settings{
	constructor(){
		this.biasServiceUrl = (BIAS_SERVER_URL || "http://localhost:3000");
		this.fbAppId = (FB_APP_ID || "250670435348050");
		this.biasCheckerAppId = (BC_APP_ID || "0909367047e24c43956ae4511cb28f00");
		this.biasCheckerSecret = (BC_APP_SECRET || "0e4f843becb044e496a317f3befc5105");
	}
}
export default Settings;