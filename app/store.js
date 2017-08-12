import { createStore, applyMiddleware } from 'redux'
import  thunk from 'redux-thunk'
import biasCheckerApp from './reducers/index'

const store = createStore(biasCheckerApp, applyMiddleware(thunk));

export default store;