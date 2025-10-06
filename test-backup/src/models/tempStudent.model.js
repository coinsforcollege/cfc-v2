import mongoose from 'mongoose';

const tempStudentSchema = new mongoose.Schema({
  tempToken: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  role: { type: String, default: 'student' },
  step: { type: Number, default: 1 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  college: mongoose.Schema.Types.ObjectId,
  graduationYear: Number,
  createNewCollege: Boolean,
  newCollegeData: Object,
  emailCode: String,
  phoneCode: String,
  codesRequestedAt: Date,
  emailCodeExpiresAt: Date,
  phoneCodeExpiresAt: Date,
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // expires in 1h
});

export const TempStudent = mongoose.model('TempStudent', tempStudentSchema);
