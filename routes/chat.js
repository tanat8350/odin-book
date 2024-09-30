const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.get('/:id', chatController.getChat);
router.get('/user/:id', chatController.getUserChatRooms);

module.exports = router;
