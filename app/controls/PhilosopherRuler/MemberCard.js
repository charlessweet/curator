import React from 'react';
import ReactDOM from 'react-dom';
import Member from '../../model/Member'

const MemberCard = (props) => {
	let roleFilter = (member) => {
		if(member.request_guardian){
			return "guardian";
		}else{
			return "guardian";
		}
	}
	let member = props.member;
	let approveAction = props.approve;
//	console.log("MemberCard", member, approveAction);
	return (
		<div className="card">
			<div className="card-content">
				<span className="card-title">{member.email}</span>
				<i>...is requesting the <b>{"Guardian"}</b> role.</i>
				<div><a href={"mailto:" + member.email}>Contact This Member</a></div>
			</div>
			<div className="card-action">
				<button id="create_member" type="button" className="btn-large waves-effect waves-light indigo lighten-1"
					onClick={()=>{approveAction(member.memberId, roleFilter(member), props.settings, props.userInfo)}}>Approve</button>&nbsp;&nbsp;
				<button id="cancel" type="button" className="orange btn-large waves-effect waves-light indigo lighten-1">Deny</button>&nbsp;&nbsp;
			</div>
		</div>
	);
};
export default MemberCard;