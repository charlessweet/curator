export default class UserIdentity{
	constructor(jwtOrUserId, userName, memberId, roles){
		if(userName === undefined){ //single parameter constructor expects decoded jwt
			this.userId = jwtOrUserId.userId
			this.userName = jwtOrUserId.name
			this.memberId = jwtOrUserId.memberId
			this.roles = jwtOrUserId.scope	
		}else{
			this.userId = jwtOrUserId;
			this.userName = userName;
			this.memberId = memberId;
			this.roles = roles;			
		}
	}
}