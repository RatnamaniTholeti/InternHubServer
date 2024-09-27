// controllers/managerController.js
const Manager = require('../models/Manager');

// @desc    Add a new Manager
// @route   POST /api/managers
exports.addManager = async (req, res) => {
    const { name, email, contactInfo, department, startDate, password } = req.body;

    try {
        let manager = await Manager.findOne({ email });
        if (manager) {
            return res.status(400).json({ message: 'Manager already exists' });
        }

        manager = new Manager({
            name,
            email,
            contactInfo,
            department,
            startDate,
            password,
        });

        await manager.save();

        res.status(201).json({
            message: `Manager ${manager.name} created successfully!`,
            name: manager.name,
            email: manager.email,
            department: manager.department,
            startDate: manager.startDate,
            role: manager.role,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all managers
// @route   GET /api/managers
exports.getManagers = async (req, res) => {
    try {
        const managers = await Manager.find();
        res.status(200).json(managers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete a manager by ID
// @route   DELETE /api/managers/:id
exports.deleteManager = async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        await manager.remove();
        res.status(200).json({ message: 'Manager removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update a manager by ID
// @route   PUT /api/managers/:id
exports.updateManager = async (req, res) => {
    const { name, email, contactInfo, department, startDate } = req.body;

    try {
        let manager = await Manager.findById(req.params.id);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        manager.name = name || manager.name;
        manager.email = email || manager.email;
        manager.contactInfo = contactInfo || manager.contactInfo;
        manager.department = department || manager.department;
        manager.startDate = startDate || manager.startDate;

        await manager.save();

        res.status(200).json({
            message: `Manager ${manager.name} updated successfully!`,
            manager,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
