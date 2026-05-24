const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
    return cachedConnection;
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    throw err;
  }
};

module.exports = connectDB;
