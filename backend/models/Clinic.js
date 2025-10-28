const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  logo: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contactPhone: String,
  contactEmail: String,
  website: String,
  registrationNumber: String,
  taxId: String,
  timezone: { type: String, default: 'Asia/Kolkata' },
  currency: { type: String, default: 'INR' },
  settings: {
    appointmentWindowDays: { type: Number, default: 30 },
    timeSlotIntervalMins: { type: Number, default: 30 },
    cancellationPolicy: {
      allowCancellation: { type: Boolean, default: true },
      hoursBeforeAppointment: { type: Number, default: 24 },
      refundPercentage: { type: Number, default: 0 }
    },
    enableOnlineBooking: { type: Boolean, default: true },
    enableTeleconsultation: { type: Boolean, default: false },
    autoReminders: {
      enabled: { type: Boolean, default: true },
      beforeHours: { type: [Number], default: [24, 2] }
    }
  },
  subscription: {
    planId: { type: String, enum: ['basic', 'pro', 'enterprise'], default: 'basic' },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    startedAt: Date,
    expiresAt: Date,
    nextBillingDate: Date,
    autoRenew: { type: Boolean, default: true }
  },
  features: {
    maxDoctors: { type: Number, default: 1 },
    maxPatients: { type: Number, default: 100 },
    maxAppointmentsPerMonth: { type: Number, default: 200 },
    teleconsultationMinutes: { type: Number, default: 0 },
    smsCredits: { type: Number, default: 0 },
    whatsappCredits: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
clinicSchema.index({ slug: 1 });
clinicSchema.index({ name: 'text' });
clinicSchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Clinic', clinicSchema);