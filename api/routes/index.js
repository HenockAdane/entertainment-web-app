const express = require("express")
const router = express.Router()
// const Products = require("./Products")
const Auth = require("api/routes/Auth.js")
const Titles = require("api/routes/Titles.js")
// const Payment = require("./Payment")

// router.use("/products", Products)
router.use("/auth", Auth)
router.use("/titles", Titles)
// router.use("/payment", Payment)

module.exports = router