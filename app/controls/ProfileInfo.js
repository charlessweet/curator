import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import Card, {CardContent} from 'material-ui/Card'

const ProfileInfo = (props) => {
        const userInfo = new UserIdentity(Auth.getDecodedJwt())
        return (
            <Card>
                <CardContent>
                    <span className="card-title">Member Profile</span>
                    <p>
                    Hi {userInfo.userName}! You can use this page to
                    update your configuration settings and options from this page.
                    </p>
                    <br/>
                    <button title="Analyze article" onClick={()=>{Auth.logout()}} className='btn waves-effect waves-light indigo lighten-1'>Logout</button>
                </CardContent>
            </Card>)
}

export default ProfileInfo;