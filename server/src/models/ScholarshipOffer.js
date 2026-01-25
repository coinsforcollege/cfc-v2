import mongoose from 'mongoose';

const requiredDocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  required: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const scholarshipOfferSchema = new mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  totalValue: {
    type: Number,
    required: [true, 'Total scholarship value is required'],
    min: [0, 'Value cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    trim: true,
    uppercase: true
  },
  terms: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  // Editable formal letter template
  formalLetter: {
    type: String,
    default: ''
  },
  // Required documents for accepting the offer
  requiredDocuments: [requiredDocumentSchema],
  // Targeting criteria for the offer
  targeting: {
    // 'individual' = specific students, 'all' = all students,
    // 'country' = by country, 'gradeLevel' = by grade, 'pointsRange' = by scholarship points
    type: {
      type: String,
      enum: ['individual', 'all', 'country', 'gradeLevel', 'pointsRange', 'combined'],
      default: 'all'
    },
    // Specific students (for individual targeting)
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    // Countries filter
    countries: [{
      type: String,
      trim: true
    }],
    // Grade levels filter
    gradeLevels: [{
      type: String,
      enum: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    }],
    // Scholarship points range filter
    pointsRange: {
      min: {
        type: Number,
        default: null
      },
      max: {
        type: Number,
        default: null
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'cancelled'],
    default: 'draft',
    index: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  // Recommended offers get prominent placement (5 per college per month)
  isRecommended: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for college's offers
scholarshipOfferSchema.index({ college: 1, status: 1 });

// Index for finding active offers
scholarshipOfferSchema.index({ status: 1, expiryDate: 1 });

// Index for recommended offers
scholarshipOfferSchema.index({ isRecommended: 1, status: 1 });

// Index for targeting queries
scholarshipOfferSchema.index({ 'targeting.type': 1, status: 1 });
scholarshipOfferSchema.index({ 'targeting.countries': 1, status: 1 });
scholarshipOfferSchema.index({ 'targeting.gradeLevels': 1, status: 1 });

const ScholarshipOffer = mongoose.model('ScholarshipOffer', scholarshipOfferSchema);

export default ScholarshipOffer;
