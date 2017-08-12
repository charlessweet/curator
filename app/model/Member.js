import Karma from './Karma'

class Member{
	constructor(memberId, email, requireGuardian){
		this.memberId = memberId;
		this.email = email;
		this.requireGuardian = requireGuardian;

		//reputation
		this.karma = new Karma(5);
	}
}
export default Member;