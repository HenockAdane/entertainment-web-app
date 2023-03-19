export const updateScreenSize = (size) => ({
    type: "UPDATESCREENSIZE",
    size
})



const IS = null

const screenSize = (state = IS, action) => {
    switch(action.type){
        case "UPDATESCREENSIZE":
            return action.size;
        default: return state
    }
}

export default screenSize