import {combineReducers} from "redux"
import screenSize from "./ScreenSize"
import currentUser from "./CurrentUser"
import search from "./Search"
import screenMessages from "./ScreenMessages"

const RootReducer = combineReducers({
    screenSize,
    currentUser,
    search,
    screenMessages
})

export default RootReducer