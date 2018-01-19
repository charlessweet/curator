import React from 'react';
import ReactDOM from 'react-dom';
import Member from '../../model/Member'
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Button from 'material-ui/Button'

const MemberCard = (props) => {
	let member = props.member
	let approveAction = props.approve
	let denyAction = props.deny
//	console.log("MemberCard", member, approveAction);
	return (
		<Card>
			<CardHeader
				title={member.email}
				avatar={<AccountCircle/>}
			/>
			<CardText> 
				<List>
					<ListItem primaryText="Member Id:" secondaryText={member.memberId} style={{wordWrap: "break-word"}} />
					<ListItem primaryText="Requested Role:" secondaryText={member.roleName} />
				</List>
			</CardText>
			<CardActions>
				<Button raised label="Approve" primary={true} onClick={()=>{approveAction(member.memberId, member.roleName)}} />
				<Button raised label="Deny" primary={false} onClick={()=>{denyAction(member.memberId, member.roleName)}} />
			</CardActions>
		</Card>
	);
};
export default MemberCard;