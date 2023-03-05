const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
