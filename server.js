require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = require('./src/app');

const port = process.env.PORT || 3000;

if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Copy .env.example to .env and add your MongoDB connection string.');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET. Copy .env.example to .env and add a secret value.');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => app.listen(port, () => console.log(`Server started at: port-${port}`)))
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });