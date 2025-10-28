const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'clinic_admin', 'doctor', 'receptionist', 'patient', 'lab', 'pharmacy'],
    default: 'patient',
    required: true
  },
  name: {
    first: { type: String, required: true, trim: true },
    last: { type: String, trim: true },
    display: { type: String, trim: true }
  },
  avatarUrl: String,
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    index: true
  },
  doctorProfile: {
    specialties: [String],
    licenseNumber: String,
    qualifications: [String],
    bio: String,
    consultationFee: Number,
    teleconsultationFee: Number,
    calendarId: String,
    workingHours: [{
      weekday: { type: Number, min: 0, max: 6 },
      from: String,
      to: String,
      breaks: [{ from: String, to: String }]
    }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 }
  },
  patientProfile: {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
  },
  twoFA: {
    enabled: { type: Boolean, default: false },
    method: { type: String, enum: ['sms', 'email', 'totp'] },
    secret: String
  },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  lastLogin: Date,
  fcmTokens: [String]
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'name.display': 'text' });

// Virtual for fullName
userSchema.virtual('fullName').get(function() {
  return `${this.name.first} ${this.name.last || ''}`.trim();
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  if (!this.name.display) {
    this.name.display = this.fullName;
  }
  
  // Hash password if modified
  if (this.isModified('passwordHash') && !this.passwordHash.startsWith('$2a$')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);