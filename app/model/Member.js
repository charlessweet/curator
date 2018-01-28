import Karma from './Karma'

class Member{
	constructor(memberId, requestDate, requestor, roleName, email){
		this.memberId = memberId;
		this.requestDate = requestDate;
		this.requestor = requestor;
		this.roleName = roleName
		this.email = email
		//reputation
//		this.karma = new Karma(5);
	}
}
export default Member;