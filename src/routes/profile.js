const express = require('express');
const profileRouter = express.Router();
const User = require('../models/users');
const { userAuth } = require('../middleware/auth');
const { validateProfileEditData } = require('../utils/validation');

// Get user profile
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error in /profile/view:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit user profile
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      return res.status(400).json({ error: 'Invalid Edit Request' });
    }

    const loggedInUser = req.user;
    const updateFields = req.body;

    Object.keys(updateFields).forEach((key) => {
      if (Array.isArray(updateFields[key])) {
        // ensure arrays like skills are properly handled
        loggedInUser[key] = [...updateFields[key]];
      } else {
        loggedInUser[key] = updateFields[key];
      }
    });

    await loggedInUser.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      data: loggedInUser,
    });
  } catch (err) {
    console.error('Error in /profile/edit:', err.message);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = profileRouter;
