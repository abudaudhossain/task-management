const express = require('express');
const { welcome, addUser } = require('../controllers/taskManagement');
const router = express.Router();

router.get('/', welcome)

router.post('/addUser', addUser)


module.exports = router;