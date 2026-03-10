const express = require('express')
const auth = require('../Middleware/authMiddleware')
const { accessChats, createGroupChat, addToGroup, fetchChats, renameGroup, removeFromGroup } = require('../Controller/chat-Controllers')


const router = express.Router()

router.post('/access', auth, accessChats)
router.get('/all', auth, fetchChats)
router.post('/group', auth, createGroupChat)
router.put('/rename', auth, renameGroup)

router.put('/groupadd', auth, addToGroup)       
router.put('/groupremove', auth, removeFromGroup) 


module.exports = router