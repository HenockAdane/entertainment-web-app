const express = require("express")
const router = express.Router()
// const Products = require("./Products")
const Auth = require("./Auth")
const Titles = require("./Titles")
// const Payment = require("./Payment")

// router.use("/products", Products)
router.use("/auth", Auth)
router.use("/titles", Titles)
// router.use("/payment", Payment)

module.exports = router