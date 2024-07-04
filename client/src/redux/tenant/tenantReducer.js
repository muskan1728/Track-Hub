import {SET_TENANT} from  "./tenantTypes";
const tenant = localStorage.getItem('tenant') ? localStorage.getItem('tenant') : ''

const initialState = {
    tenant:tenant,
}

const tenantReducer = (state=initialState,action)=>{
    switch(action.type){
        case SET_TENANT:
            const { payload, callback } = action

            const updatedState={
                ...state,
                tenant:action.payload
            }
            if (callback) {
                callback(payload)
              }
              return updatedState

        default : return state
    }
}

export default tenantReducer