import React from 'react'
import PropTypes from 'prop-types'
import MemberCard from './MemberCard'
import Member from '../../model/Member'
import store from '../../store'

const MemberCardList = (props) => {
	let id = 0 //hack until i enforce better business rules
	if(props.members.length >0)
		return (
		<div id="requests" className="container">
		{
			props.members.members.map((mem)=>{
				let member = new Member(mem.memberId, mem.requestDate, mem.requestor, mem.roleName);
				return <MemberCard settings={props.settings} userInfo={props.userInfo} approve={props.approve} deny={props.deny} key={id++} member={mem} />
			})
		}
		</div>)
	else
		return (<div className="container">
            <div className="card">
                <div className="card-content">
                    <span className="card-title">This Queue is Empty</span>
                    <p>
                    Requests to become moderators will populate this list.
                    </p>
                </div>
            </div>
        </div>)
}

export default MemberCardList;
