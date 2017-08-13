import React from 'react'
import PropTypes from 'prop-types'
import MemberCard from './MemberCard'
import Member from '../../model/Member'
import store from '../../store'

const MemberCardList = (props) => {
	if(props.members.length >0)
		return (
		<div id="requests" className="container">
		{
			props.members.map((mem)=>{
				let member = new Member(mem.memberId, mem.email, mem.require_guardian);
				return <MemberCard settings={props.settings} userInfo={props.userInfo} approve={props.approve} key={mem.memberId} member={mem} />
			})
		}
		</div>)
	else
		return (<div id="requests"><h4>This queue is empty</h4><div>Requests to become moderators will go here.</div></div>)
}

export default MemberCardList;
