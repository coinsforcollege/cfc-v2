import mongoose from 'mongoose';

const bridgeLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  exchangeUserId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'revoked', 'migrated'],
    default: 'pending',
    index: true
  },
  stateToken: {
    type: String,
    default: null,
    index: true,
    sparse: true
  },
  stateTokenExpiresAt: {
    type: Date,
    default: null
  },
  linkedAt: {
    type: Date,
    default: null
  },
  revokedAt: {
    type: Date,
    default: null
  },
  metadata: {
    exchangeEmail: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true
});

const BridgeLink = mongoose.model('BridgeLink', bridgeLinkSchema);

export default BridgeLink;
