import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'

const ProfileInfo = (props) => {
        return (<div className="container">
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Member Profile</span>
                    <p>
                    Hi! You're logged in as {props.userInfo.userName}. You can use this page to
                    update your configuration settings and options from this page.
                    </p>
                    <br/>
                    <button title="Analyze article" onClick={()=>{Auth.logout()}} className='btn waves-effect waves-light indigo lighten-1'>Logout</button>
                </div>
            </div>
        </div>)
}

export default ProfileInfo;