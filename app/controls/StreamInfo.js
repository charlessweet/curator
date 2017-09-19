import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'

const StreamInfo = (props) => {
        let userInfo = props.userInfo
        let guardianBlurbStyle = { "display":"none"}
        if(userInfo.roles.filter((x) => x=='guardian') !== undefined){
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
                    <div style={guardianBlurbStyle} >
                    <p>As a <b>Guardian</b>, you can add Cx (out of context), Le (logical error), or Fe (factual error) information to the articles below by clicking on the corresponding element icon, if the 
                    article has not already been reviewed. Look for the 'N/A' score as an indicator of an article ready for your review.</p>
                    <br/>
                    <BoxElement article={{}} aspect="demo" />
                    </div>
                </div>
                <div className="card-action">
                    <Link to="/stream/123456">Link to Article Test</Link>
                </div>
            </div>
        </div>)
}

export default StreamInfo;