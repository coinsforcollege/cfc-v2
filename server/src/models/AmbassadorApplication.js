import mongoose from 'mongoose';

const ambassadorApplicationSchema = new mongoose.Schema({
  // Student Information
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  
  // Application Details
  yearOfStudy: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Other'],
    required: [true, 'Year of study is required']
  },
  major: {
    type: String,
    required: [true, 'Major/Field of study is required'],
    trim: true
  },
  
  // Experience & Skills
  leadershipExperience: {
    type: String,
    required: [true, 'Leadership experience is required']
  },
  campusInvolvement: {
    type: String,
    required: [true, 'Campus involvement details are required']
  },
  whyAmbassador: {
    type: String,
    required: [true, 'This field is required']
  },
  socialMediaHandles: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  availability: {
    hoursPerWeek: {
      type: String,
      enum: ['5-10 hours', '10-15 hours', '15-20 hours', '20+ hours'],
      required: [true, 'Availability is required']
    },
    preferredActivities: [{
      type: String,
      enum: [
        'Organize Events',
        'Social Media Marketing',
        'Content Creation',
        'Community Management',
        'Campus Outreach',
        'Workshop Facilitation'
      ]
    }]
  },
  
  // Additional Info
  referredBy: {
    type: String,
    default: ''
  },
  additionalComments: {
    type: String,
    default: ''
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Index for faster queries
ambassadorApplicationSchema.index({ student: 1 });
ambassadorApplicationSchema.index({ status: 1, submittedAt: -1 });
ambassadorApplicationSchema.index({ college: 1 });

const AmbassadorApplication = mongoose.model('AmbassadorApplication', ambassadorApplicationSchema);

export default AmbassadorApplication;

