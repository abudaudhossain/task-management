const express = require('express');
const { HomePage, addUser, loginUser, LoginPage, Register } = require('../controllers/taskManagement');
const router = express.Router();

// router.get('/:id', )
router.get('/', HomePage)
router.get('/home', HomePage)
router.get('/login', LoginPage)
router.get('/register', Register)

router.post('/addUser', addUser)
router.post('/login', loginUser)



module.exports = router;