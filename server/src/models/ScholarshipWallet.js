import mongoose from 'mongoose';

const scholarshipWalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const ScholarshipWallet = mongoose.model('ScholarshipWallet', scholarshipWalletSchema);

export default ScholarshipWallet;
