import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'
import Card, {CardHeader, CardContent} from 'material-ui/Card'
import Typography from 'material-ui/Typography'

const CreateAccountInfo = (props) => {
        return (
            <Card>
                <CardContent>
					<Typography type="headline" component="h4">
		                {"Create an Account"}
		            </Typography>
		            <Typography component="p">
	                    Create a new account to start analyzing articles today!
		            </Typography>
                </CardContent>
            </Card>)
}

export default CreateAccountInfo;