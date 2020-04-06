import {combineReducers} from 'redux'
import {testContentReducer,questionAttempt,userDataReducer} from './testReducers'

const rootReducer = combineReducers({
    testContent:testContentReducer,
    attempts:questionAttempt,
    userData:userDataReducer
})

export default rootReducer