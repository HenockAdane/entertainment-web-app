const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TitleSchema = Schema({
    // id: {
    //     type: Number,
    //     required: true
    // },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Object,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    isTrending: {
        type: Boolean,
        required: true
    }

})
const titleModel = mongoose.model("title", TitleSchema)
module.exports = titleModel