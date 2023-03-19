export const setSearchTitles = (searchTitles) => ({
    type: "SETSEARCHTITLES",
    searchTitles
})

export const setSearchActive = (searchActive) => ({
    type: "setActive",
    searchActive
})

const IS= {titles: [], active: false}
const search = (state = IS, action) => {
    switch(action.type){
        case "SETSEARCHTITLES":
            return {...state, titles: action.searchTitles};
        case "setActive":
            return {...state, active: action.searchActive};
        default: return state
    }
}

export default search