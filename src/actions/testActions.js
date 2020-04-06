/*This is an action creator, which is returning an action, an action is nothing but an object
 * with fields type and payload */
import {testContent} from '../Data'
import {actions} from '../constants'
export function setTestContent(testContent){
     return{
         type:actions.FETCH_TEST_CONTENT,
         payload:testContent
     }  
}

export function setQuestionOption(qId,attemptObj){
    return {
        type:actions.SET_QUESTION_ATTEMPT,
        payload:{
            [qId]:attemptObj
        }
    } 
}
export function resetAttempts(){
    return {
        type:actions.RESET_ATTEMPTS
    } 
}

export function setUserData(data){
    return {
        type:actions.SET_USER_DATA,
        payload:data
    }
}