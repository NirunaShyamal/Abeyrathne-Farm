// Optional shared connection helper (not currently used by api/index.js)
// Provided to match the recommended layout and for future direct function handlers
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.warn('MONGO_URI not set in env. Set it in Vercel Project Settings.');
}

let cached = global.__mongoose_conn;
if (!cached) cached = global.__mongoose_conn = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, { dbName: process.env.DB_NAME || 'farm_management' })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
