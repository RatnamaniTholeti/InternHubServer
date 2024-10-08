const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Admin credentials (hardcoded)
const adminCredentials = {
    email: 'admin@gmail.com',
    password: 'admin',
};

// Login handler
exports.login = async (req, res) => {
    const { email, password, role } = req.body; // Ensure role is also being passed

    try {
        // Hardcoded Admin login
        if (role === 'admin' && email === adminCredentials.email) {
            if (password === adminCredentials.password) {
                const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token, role: 'admin' });
            } else {
                return res.status(400).json({ message: 'Invalid admin credentials' });
            }
        }

        // For Managers, fetch data from the manager API
        if (role === 'manager') {
            const response = await axios.get('https://internhub-server-final1.vercel.app/api/managers');
            const managers = response.data;

            // Check if the email and password match any manager
            const manager = managers.find(m => m.email === email);
            if (!manager) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare passwords (using bcrypt for hashing, if necessary)
            const isMatch = await bcrypt.compare(password, manager.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create JWT payload for the manager
            const payload = {
                user: {
                    id: manager._id,
                    role: 'manager',
                },
            };

            // Sign token
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, role: 'manager' });
        }

        // For Interns, fetch data from the intern API
        if (role === 'intern') {
            const response = await axios.get('https://internhub-server-final1.vercel.app/api/interns'); // Update the API endpoint accordingly
            const interns = response.data;

            // Check if the email and password match any intern
            const intern = interns.find(i => i.email === email);
            if (!intern) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare plaintext password directly
            if (intern.password !== password) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create JWT payload for the intern
            const payload = {
                user: {
                    id: intern._id,
                    role: 'intern',
                },
            };

            // Sign token
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, role: 'intern' });
        }

        // If role is not recognized
        return res.status(400).json({ message: 'Role is not valid.' });

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

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        user = new User({
            email,
            password: hashedPassword,
            role,
        });

        await user.save();

        res.status(201).json({ message: `${role} account created successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
