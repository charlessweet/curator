import { createStore, applyMiddleware } from 'redux'
import  thunk from 'redux-thunk'
import biasCheckerApp from './reducers/reducers'

const store = createStore(biasCheckerApp, applyMiddleware(thunk));

export default store;