//when a user logs in or signs up, this function will assign that user to a state
export const setUser = (user) => ({
    type: "SETUSER",
    user
})


//when a user updates it's profile, it will update the user state. (e.g a user changing their password)
export const updateUser = (payload) => ({
    type:"UPDATEUSER",
    payload
})


const IS = null


const currentUser = (state = IS, action) => {
    switch(action.type){
        case "SETUSER":
            return action.user;
        case "UPDATEUSER": 
            return {...state, ...action.payload}
        default: return state
    }
}

export default currentUser