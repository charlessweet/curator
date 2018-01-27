import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Card, {CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'

const StreamInfo = (props) => {
        let userInfo = props.userInfo
        let guardianBlurbStyle = { "display":"none"}
        if(userInfo.roles !== undefined && userInfo.roles.filter((x) => x=='guardian') !== undefined){
            guardianBlurbStyle.display = "block"
        }
        return (<div className="container"><Card>
            <CardContent>
                <Typography type="headline" component="h4">
                  {"Welcome to the Article Stream!"}
                </Typography>
                <Typography component="p">
                    This page displays the most recent articles checked in Curator (in reverse chronological order). Keeping an eye on this information
                    will give you some insight into the themes of the news cycle, and types of articles being viewed on Facebook.
                </Typography>
            </CardContent>
        </Card></div>)
}

export default StreamInfo;