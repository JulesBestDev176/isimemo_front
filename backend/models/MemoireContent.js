const mongoose = require('mongoose');

const memoireContentSchema = new mongoose.Schema({
  memoireId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  fullText: {
    type: String,
    required: true
  },
  tokens: {
    type: [String],
    default: [],
    index: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  extractedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index textuel pour la recherche full-text
memoireContentSchema.index({
  fullText: 'text',
  tokens: 'text'
}, {
  weights: {
    fullText: 10,
    tokens: 5
  },
  name: 'memoire_content_text_index'
});

const MemoireContent = mongoose.models.MemoireContent || mongoose.model('MemoireContent', memoireContentSchema);

module.exports = MemoireContent;
