const express = require('express');
const route = express.Router();
const auth_controller = require('../controller/auth.controller');

//POST API -> /api/auth/register(for user Registration)
route.post('/register', auth_controller.userRegistration);

//POST API -> /api/auth/login(for user Login)
route.post('/login',auth_controller.userLogin);

module.exports = route;
