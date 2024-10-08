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

router.get('/:id', auth, async (req, res) => {
    try {
      const manager = await Manager.findById(req.params.id);
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
      res.json(manager);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
