import React from 'react';
import ReactDOM from 'react-dom';
import Member from '../../model/Member'
import List, {ListItem, ListItemText} from 'material-ui/List';
import Card, {CardContent} from 'material-ui/Card';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
const MemberCard = (props) => {
	let member = props.member
	let approveAction = props.approve
	let denyAction = props.deny
//	console.log("MemberCard", member, approveAction);
	return (
		<Card>
			<CardContent>
				<Typography component="h4">
					{member.email}
					{<AccountCircle/>}
				</Typography>
			</CardContent>
			<CardContent> 
				<List>
					<ListItem >
						<ListItemText primary="Member Id:" secondary={member.memberId} style={{wordWrap: "break-word"}}/>
					</ListItem>
					<ListItem>
						<ListItemText primary="Requested Role:" secondary={member.roleName} />
					</ListItem>
				</List>
			</CardContent>
			<CardContent>
				<Button raised className="primary" onClick={()=>{approveAction(member.memberId, member.roleName)}}>Approve</Button>
				<Button raised className="secondary" onClick={()=>{denyAction(member.memberId, member.roleName)}} >Deny</Button>
			</CardContent>
		</Card>
	);
};
export default MemberCard;