// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin credentials (hardcoded)
const adminCredentials = {
    email: 'admin@gmail.com',
    password: 'admin',
};

// Login handler
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hardcoded Admin login
        if (email === adminCredentials.email) {
            if (password === adminCredentials.password) {
                const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token, role: 'admin' });
            } else {
                return res.status(400).json({ message: 'Invalid admin credentials' });
            }
        }

        // Manager/Intern login from database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Admin creates Manager/Intern
exports.createUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Only Admin can create users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ email, password, role });
        await user.save();

        res.status(201).json({ message: `${role} account created successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
