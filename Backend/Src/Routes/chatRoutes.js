const express = require('express')
const auth = require('../Middleware/authMiddleware')
const { accessChats, createGroupChat, addToGroup, fetchChats, renameGroup, removeFromGroup } = require('../Controller/chat-Controllers')


const router = express.Router()

/**
 * @route POST /api/chat/access
 * @desc Accesses an existing 1-on-1 chat or creates a new one between the logged-in user and the recipient
 * @access Private (Requires Bearer Token)
 */
router.post('/access', auth, accessChats)

/**
 * @route GET /api/chat/all
 * @desc Retrieves all active chats (both private and group) for the logged-in user
 * @access Private (Requires Bearer Token)
 */
router.get('/all', auth, fetchChats)

/**
 * @route POST /api/chat/group
 * @desc Creates a new group chat with specified participants
 * @access Private (Requires Bearer Token)
 */
router.post('/group', auth, createGroupChat)

/**
 * @route PUT /api/chat/rename
 * @desc Renames an existing group chat (Admin permission required)
 * @access Private (Requires Bearer Token)
 */
router.put('/rename', auth, renameGroup)

/**
 * @route PUT /api/chat/add
 * @desc Adds a user to an existing group chat (Admin permission required)
 * @access Private (Requires Bearer Token)
 */
router.put('/add', auth, addToGroup)       

/**
 * @route PUT /api/chat/remove
 * @desc Removes a user from an existing group chat (Admin permission required)
 * @access Private (Requires Bearer Token)
 */
router.put('/remove', auth, removeFromGroup) 


module.exports = router