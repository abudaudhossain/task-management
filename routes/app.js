const express = require('express');
const { welcome, addUser, loginUser } = require('../controllers/taskManagement');
const router = express.Router();

router.get('/', welcome)

router.post('/addUser', addUser)
router.post('/login', loginUser)


module.exports = router;