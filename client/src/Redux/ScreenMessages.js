export const toggleSlideInfo = (toggle) => ({
    type: "TOGGLESLIDEINFO",
    toggle
})

export const displayUserAuthTimeOut = (display) => ({
    type: "DISPLAYUSERAUTHTIMEOUT",
    display

})

const IS = {
    slideInfo: false,
    displayUserAuthTimeOut: false
}

const screenMessages = (state = IS, action) => {
    switch(action.type){
        case "TOGGLESLIDEINFO":
            return {...state, slideInfo: action.toggle}
        case "DISPLAYUSERAUTHTIMEOUT":
            return {...state, displayUserAuthTimeOut: action.display}
        default: return state
    }
}

export default screenMessages