// routes/managerRoutes.js
const express = require('express');
const { addManager, getManagers, deleteManager, updateManager } = require('../controllers/managerController');
const router = express.Router();

// @route   POST /api/managers
// @desc    Create a new manager
router.post('/', addManager);

// @route   GET /api/managers
// @desc    Get all managers
router.get('/', getManagers);

// @route   DELETE /api/managers/:id
// @desc    Delete a manager by ID
router.delete('/:id', deleteManager);

// @route   PUT /api/managers/:id
// @desc    Update a manager by ID
router.put('/:id', updateManager);

module.exports = router;
