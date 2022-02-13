const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true
  },
  stockingDate: {
    type: Date,
    default: Date.now
  },
  animalCount: {
    type: String,
    required: true
  },
  EventOccurenceTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = Batch = mongoose.model('batch', BatchSchema);