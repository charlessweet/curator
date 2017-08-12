export default class UserIdentity{
	constructor(userId, userName, picture, biasToken, facebookUserId, memberId, roles){
		this.userId = userId;
		this.userName = userName;
		this.picture = picture;
		this.biasToken = biasToken;
		this.facebookUserId = facebookUserId;
		this.memberId = memberId;
		this.roles = roles;
	}
}