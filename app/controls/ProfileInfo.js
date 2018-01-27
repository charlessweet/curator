import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'
import UserIdentity from '../model/UserIdentity'
import Card, {CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

const ProfileInfo = (props) => {
        const userInfo = new UserIdentity(Auth.getDecodedJwt())
        return (
            <div className="container">
            <Card>
                <CardContent>
                    <Typography type="headline" component="h4">
                      Member Profile for {userInfo.userName}
                    </Typography>
                    <Typography component="p">
                        Update your configuration settings and options from this page.
                    </Typography>
                    <br/>
                    <Button title="Analyze article" onClick={()=>{Auth.logout()}} className='primary'>Logout</Button>
                </CardContent>
            </Card>
            </div>)
}

export default ProfileInfo;