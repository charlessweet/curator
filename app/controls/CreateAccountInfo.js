import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'

const CreateAccountInfo = (props) => {
        return (
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Create a new BiasChecker Account</span>
                    <p>
                    Create a new account to start analyzing articles today!
                    </p>
                </div>
            </div>)
}

export default CreateAccountInfo;