const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  genre: {
    type: String,
    required: true,
    enum: ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Racing', 'Sports', 'Simulation', 'Horror', 'Indie']
  },
  platform: [{
    type: String,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Web']
  }],
  developer: {
    type: String,
    required: true
  },
  publisher: String,
  releaseDate: Date,
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  images: [{
    type: String
  }],
  trailer: String,
  downloadLink: String,
  tags: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', gameSchema);