const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'Public')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'Public', 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '..', 'Public', 'dashboard.html')));
app.use('/auth', authRoutes);
app.use('/', fileRoutes);

app.use((err, req, res, next) => {
    res.status(400).json({ message: err.message });
});

module.exports = app;
