const express = require('express');
const chatRouter = express.Router();
const Message = require('../models/message');
const { userAuth } = require('../middleware/auth');

// Route to get chat history between two users
chatRouter.get('/chat/:targetUserId',userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const targetUserId = req.params.targetUserId;

    // Room ID logic (always sorted the same way)
    const roomId = [userId, targetUserId].sort().join('-');


    // Fetch messages for that room
      const messages = await Message.find({ roomId })
      .populate('senderId', 'firstName lastName')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error in /chat/:targetUserId:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = chatRouter;
