export default class UserIdentity{
	constructor(userId, userName, picture, biasToken, facebookUserId, memberId, roles, jwt){
		this.userId = userId;
		this.userName = userName;
		this.picture = picture;
		this.biasToken = biasToken;
		this.facebookUserId = facebookUserId;
		this.memberId = memberId;
		this.roles = roles;
		this.jwt = jwt;
	}
}