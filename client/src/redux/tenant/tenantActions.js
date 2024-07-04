import { SET_TENANT } from "./tenantTypes"
export const setTenant = (tenant,callback)=>{
    return {
        type: SET_TENANT,
        payload:tenant,
        callback
    }
}