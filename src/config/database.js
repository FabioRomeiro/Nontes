const mongoose = require('mongoose');

const mongoConnectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017';
const mongoDB = `${mongoConnectionString}/nontes`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
