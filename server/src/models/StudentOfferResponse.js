import mongoose from 'mongoose';

const submittedDocumentSchema = new mongoose.Schema({
  // Reference to the required document from the offer
  requiredDocId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Reference to the actual document submitted
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const studentOfferResponseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScholarshipOffer',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    index: true
  },
  // Documents submitted when accepting
  submittedDocuments: [submittedDocumentSchema],
  // When the student responded
  respondedAt: {
    type: Date,
    default: null
  },
  // Reason if rejected (optional)
  rejectionReason: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for finding student's response to an offer
studentOfferResponseSchema.index({ student: 1, offer: 1 }, { unique: true });

// Index for offer responses lookup
studentOfferResponseSchema.index({ offer: 1, status: 1 });

// Index for student's offers by status
studentOfferResponseSchema.index({ student: 1, status: 1 });

const StudentOfferResponse = mongoose.model('StudentOfferResponse', studentOfferResponseSchema);

export default StudentOfferResponse;
