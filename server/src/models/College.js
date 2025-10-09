import mongoose from 'mongoose';

const tokenUtilitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { _id: false });

const collegeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    index: true
  },
  shortName: {
    type: String,
    trim: true,
    default: ''
  },
  tagline: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String,
    enum: ['University', 'College', 'Institute', 'School', 'Other'],
    default: 'University'
  },
  
  // Location
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  state: {
    type: String,
    trim: true,
    default: ''
  },
  city: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  zipCode: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Media
  logo: {
    type: String, // URL to logo image
    default: null
  },
  coverImage: {
    type: String, // URL to hero/cover image
    default: null
  },
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['campus', 'facility', 'event', 'classroom', 'other'],
      default: 'campus'
    }
  }],
  videoUrl: {
    type: String,
    default: ''
  },
  
  // About
  description: {
    type: String,
    trim: true,
    default: ''
  },
  about: {
    type: String, // Long form about text
    default: ''
  },
  mission: {
    type: String,
    default: ''
  },
  vision: {
    type: String,
    default: ''
  },
  
  // Contact & Links
  website: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  
  // Academic Information
  establishedYear: {
    type: Number,
    default: null
  },
  accreditations: [{
    name: String,
    year: Number
  }],
  rankings: [{
    source: String,
    rank: Number,
    year: Number,
    category: String
  }],
  
  // Programs & Courses
  programs: [{
    name: String,
    degree: {
      type: String,
      enum: ['Associate', 'Bachelor', 'Master', 'Doctorate', 'Certificate', 'Diploma', 'Other'],
      default: 'Bachelor'
    },
    duration: String, // e.g., "4 years"
    description: String
  }],
  departments: [String],
  
  // Highlights & Features
  highlights: [{
    title: String,
    description: String,
    icon: String // Icon name or URL
  }],
  
  // Campus & Facilities
  facilities: [{
    name: String,
    description: String,
    icon: String
  }],
  campusSize: {
    value: Number,
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'sq ft', 'sq meters'],
      default: 'acres'
    }
  },
  
  // Student Life
  studentLife: {
    totalStudents: Number,
    internationalStudents: Number,
    studentToFacultyRatio: String,
    clubs: Number,
    sports: [String],
    housing: {
      available: Boolean,
      capacity: Number,
      description: String
    }
  },
  
  // Admissions
  admissions: {
    acceptanceRate: Number,
    applicationDeadline: String,
    requirements: String,
    tuitionFee: {
      domestic: Number,
      international: Number,
      currency: String
    }
  },
  // Admin reference (only one admin per college)
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Token preferences (data collection only)
  tokenPreferences: {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    ticker: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    maximumSupply: {
      type: Number,
      default: null
    },
    preferredIcon: {
      type: String, // URL
      default: null
    },
    preferredLaunchDate: {
      type: Date,
      default: null
    },
    preferredUtilities: [tokenUtilitySchema],
    needExchangeListing: {
      type: Boolean,
      default: true
    },
    allocationForEarlyMiners: {
      type: Number,
      default: null
    }
  },
  // Statistics
  stats: {
    totalMiners: {
      type: Number,
      default: 0
    },
    activeMiners: {
      type: Number,
      default: 0
    },
    totalTokensMined: {
      type: Number,
      default: 0
    }
  },
  // Additional informational content (legacy - can be deprecated)
  additionalInfo: {
    type: String,
    default: ''
  },
  // For sorting/ranking
  rank: {
    type: Number,
    default: 0
  },
  // College Status
  status: {
    type: String,
    enum: ['Unaffiliated', 'Waitlist', 'Building', 'Live'],
    default: 'Unaffiliated'
  },
  // Legacy fields (deprecated - kept for backward compatibility)
  isOnWaitlist: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Creator info (student who created it if admin hasn't claimed)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
collegeSchema.index({ name: 'text', country: 'text', description: 'text' });
collegeSchema.index({ country: 1 });
collegeSchema.index({ 'stats.totalMiners': -1 });
collegeSchema.index({ 'stats.totalTokensMined': -1 });

const College = mongoose.model('College', collegeSchema);

export default College;

