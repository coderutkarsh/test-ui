import {actions} from '../constants'
export function testContentReducer(state=null,action){
    switch (action.type){
        case actions.FETCH_TEST_CONTENT:
            return action.payload
        }
return state
}

export function questionAttempt(state={},action){
    switch(action.type){
        case actions.SET_QUESTION_ATTEMPT:
            return Object.assign(state,action.payload)
        case actions.RESET_ATTEMPTS:
            return {}
        }

    return state
}

export function userDataReducer(state=null,action){
    switch (action.type){
        case actions.SET_USER_DATA:
            return action.payload
        }
return state
}



// export function 