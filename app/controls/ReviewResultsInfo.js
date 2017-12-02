import React from 'react'
import ReactDOM from 'react-dom'
import BoxElement from './BoxScore/BoxElement'
import {Link} from 'react-router-dom'
import Auth from '../model/Auth'

const ReviewResultsInfo = (props) => {
        return (
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Review Details</span>
                    <p>
                    You clicked on the Article BoxScore! On this page, you can see the details that went into calculating that score. If
                    you are a Guardian, you can also add more details about the article quality.
                    </p>
                </div>
            </div>)
}

export default ReviewResultsInfo