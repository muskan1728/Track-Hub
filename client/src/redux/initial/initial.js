export const RESET_STATE ='RESET_STATE'
const initialState = {
    
}


export const resetReducer = (state=initialState,action)=>{
    switch(action.type){
        case RESET_STATE:
            localStorage.setItem('user','');
            localStorage.setItem('tenant','');


            return state
        default : return state
    }
}

export const resetState = (state)=>{
    return {
        type: RESET_STATE,
    }
}