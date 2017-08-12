import Member from './Member'

export default class MemberList{
	constructor(members){
		this.members = members.map((a) => new Member(a.memberId, a.email, a.request_guardian));
		this.length = members.length;
	}
	
	equals(otherList){
		if(otherList.length !== this.length){
			return false;
		}

		for(var i = 0; i < this.members.length; i++){
			let memberId = this.members[i].memberId;
			let require_guardian = this.members[i].require_guardian;
			if(!otherList.members.find((x) => { x.memberId == memberId && x.require_guardian == require_guardian })){
				return false;
			}
		}

		return true;
	}
}