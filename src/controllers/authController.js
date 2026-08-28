const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
    return jwt.sign(
        { userId: user._id.toString(), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email: normalizedEmail, password: passwordHash });
        res.status(201).json({ token: createToken(user), user: publicUser(user) });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email?.toLowerCase().trim() });
        if (!user || !(await bcrypt.compare(password || '', user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ token: createToken(user), user: publicUser(user) });
    } catch (error) {
        next(error);
    }
}

async function getCurrentUser(req, res) {
    res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, getCurrentUser };
