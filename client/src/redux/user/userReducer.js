import {LOGIN_USER} from  "./userTypes";
const user = localStorage.getItem('user') ? localStorage.getItem('user') : ''

const initialState = {
    user:user,
}

const userReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'LOGIN_USER':
            const { payload, callback } = action
            const updatedState =  {
                ...state,
                user:action.payload
            }
            if (callback) {
                callback(payload)
              }
        
              return updatedState

        default : return state

        
    }
}

export default userReducer