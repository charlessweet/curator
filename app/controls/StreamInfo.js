import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'

const StreamInfo = (props) => {
        let userInfo = props.userInfo
        let guardianBlurbStyle = { "display":"none"}
        if(userInfo.roles !== undefined && userInfo.roles.filter((x) => x=='guardian') !== undefined){
            guardianBlurbStyle.display = "block"
        }
        return (<div className="container">
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Welcome to the Article Stream!</span>
                    <p>
                    This page is the most recent 1000 articles checked in Curator (in reverse chronological order). Keeping an eye on this information
                    will give you some insight into the themes of the news cycle, and types of articles being viewed on Facebook.
                    </p>
                    <br/>
                </div>
            </div>
        </div>)
}

export default StreamInfo;