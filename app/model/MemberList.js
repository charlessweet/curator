import Member from './Member'

export default class MemberList{
	constructor(members){
		this.members = members.map((a) => new Member(a.memberId, a.requestDate, a.requestor, a.roleName, a.email));
		this.length = members.length;
	}
	
	equals(otherList){
		if(otherList.length !== this.length){
			return false;
		}

		for(var i = 0; i < this.members.length; i++){
			let memberId = this.members[i].memberId;
			let roleName = this.members[i].roleName;
			if(!otherList.members.find((x) => { x.memberId == memberId && x.roleName == roleName })){
				return false;
			}
		}

		return true;
	}
}