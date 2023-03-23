const express = require("express")
const router = express.Router()
const controller = require("api/controller/TitleController.js")
const verifyJWT = require("api/controller/VerifyJWT.js")

router.get("/", controller.getAll)
router.get("/search/:q", controller.getSearchQuery)
router.get("/category/:category", controller.getCategory)
router.put("/toggle-bookmark", verifyJWT, controller.toggleBookmark)
router.get("/bookmarks", verifyJWT, controller.getBookmarks)
// router.get("/product/:product", controller.getProduct)
// router.get("/search/:value", controller.getProductBySearch)
// router.post("/favourite", controller.toggleFavourite)

module.exports = router