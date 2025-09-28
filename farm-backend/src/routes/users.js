const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, getAllUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats', authenticateToken, requireAdmin, getUserStats);

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin only)
router.get('/:id', authenticateToken, requireAdmin, getUserById);

// @route   POST /api/users
// @desc    Create new user (Admin only)
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, createUser);

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

module.exports = router;

