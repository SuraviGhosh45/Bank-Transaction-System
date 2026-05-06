const express=require('express');
const authController=require('../controller/auth.controller')

//creating router
const router=express.Router()

/* api/auth/register  */
router.post("/register",authController.userRegistrationController)


/* api/auth/login */
router.post("/login",authController.userLoginController)


module.exports=router