import { LOGIN_USER } from "./userTypes"
export const loginUser = (user,callback)=>{
    return {
        type: LOGIN_USER,
        payload:user,
        callback
    }
}