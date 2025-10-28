const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
    index: true
  },
  patientNumber: { type: String, unique: true },
  demographics: {
    dob: Date,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    heightCm: Number,
    weightKg: Number,
    bmi: Number
  },
  contact: {
    phone: String,
    email: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    isPrimary: { type: Boolean, default: false }
  }],
  allergies: [{
    substance: String,
    reaction: String,
    severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
    verifiedBy: String,
    verifiedDate: Date
  }],
  chronicConditions: [{
    code: String,
    name: String,
    diagnosedDate: Date,
    notes: String,
    isActive: { type: Boolean, default: true }
  }],
  surgeries: [{
    title: String,
    date: Date,
    hospital: String,
    surgeon: String,
    outcome: String,
    notes: String
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date,
    administeredBy: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: String,
    refillAllowed: Boolean,
    refillCount: { type: Number, default: 0 }
  }],
  socialHistory: {
    smoking: { type: Boolean, default: false },
    alcohol: { type: String, enum: ['none', 'occasional', 'regular', 'heavy'] },
    exercise: { type: String, enum: ['none', 'light', 'moderate', 'heavy'] },
    occupation: String,
    maritalStatus: String
  },
  insurance: {
    provider: String,
    policyNumber: String,
    validFrom: Date,
    validTill: Date,
    coverageAmount: Number
  },
  preferences: {
    preferredLanguage: String,
    communicationChannel: { type: String, enum: ['sms', 'email', 'whatsapp', 'all'] }
  },
  stats: {
    totalVisits: { type: Number, default: 0 },
    lastVisitDate: Date,
    totalSpent: { type: Number, default: 0 },
    outstandingBalance: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
patientSchema.index({ userId: 1 });
patientSchema.index({ clinicId: 1 });
patientSchema.index({ patientNumber: 1 });
patientSchema.index({ 'contact.phone': 1 });

// Pre-save middleware
patientSchema.pre('save', function(next) {
  // Calculate BMI
  if (this.demographics.heightCm && this.demographics.weightKg) {
    const heightM = this.demographics.heightCm / 100;
    this.demographics.bmi = (this.demographics.weightKg / (heightM * heightM)).toFixed(1);
  }
  
  // Calculate age
  if (this.demographics.dob) {
    const today = new Date();
    const birthDate = new Date(this.demographics.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.demographics.age = age;
  }
  
  next();
});

module.exports = mongoose.model('Patient', patientSchema);