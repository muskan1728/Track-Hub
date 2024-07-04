import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import tenantReducer from "./tenant/tenantReducer";
import { resetReducer } from "./initial/initial";
const rootReducer = combineReducers({
    user:userReducer,
    tenant:tenantReducer,
    reset:resetReducer
})

export default rootReducer;