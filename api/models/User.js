const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // birthDate: {
    //     type: String,
    //     required: true
    // },
    bookmarks: {
        type: Array,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    // gender: {
    //     type: String,
    //     required: true
    // },
    confirmed: {
        type: Boolean,
        required: true
    },
    confirmationCode: {
        type: Object,
        required: false
    }

})

const userModel = mongoose.model("user", UserSchema)

module.exports = userModel