const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const { generateToken, hashPassword, comparePassword, authenticateToken } = require('../middleware/auth');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, emailId, password, fullName } = req.body;

        // Validation
        if (!username || !emailId || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { emailId }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.username === username 
                    ? 'Username already exists' 
                    : 'Email already exists' 
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = new User({
            username,
            emailId,
            password: hashedPassword,
            fullName: fullName || username
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                emailId: newUser.emailId,
                fullName: newUser.fullName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user (can login with username or email)
        const user = await User.findOne({
            $or: [{ username }, { emailId: username }]
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                emailId: user.emailId,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current user (protected route)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                emailId: user.emailId,
                fullName: user.fullName,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route (optional - mainly for client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;