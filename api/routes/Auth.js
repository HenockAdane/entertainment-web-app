const express = require("express")
const router = express.Router()
const controller = require("api/controller/AuthController.js")
const verifyJWT = require("api/controller/VerifyJWT.js")

router.post("/signup", controller.signUp)
router.post("/signin", controller.signIn)
// router.post("/signOut", controller.signOut)
router.post("/confirm-account", verifyJWT ,controller.confirmAccount)
router.post("/resend-confirmation-code", verifyJWT, controller.resendConfirmationCode)
router.get("/load-user", verifyJWT, controller.loadUser)
router.get("/signout", controller.signOut)
router.put("/account/change/email", verifyJWT, controller.changeEmail)
router.put("/account/change/password", verifyJWT, controller.changePassword)
router.delete("/account/delete", verifyJWT, controller.deleteAccount)
// router.put("/updateAccount", verifyJWT, controller.updateAccount)

module.exports = router

