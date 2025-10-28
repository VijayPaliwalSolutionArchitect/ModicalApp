const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  appointmentNumber: { type: String, unique: true },
  type: {
    type: String,
    enum: ['in_clinic', 'teleconsultation', 'home_visit'],
    default: 'in_clinic'
  },
  status: {
    type: String,
    enum: ['requested', 'scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  slot: {
    start: { type: Date, required: true, index: true },
    end: { type: Date, required: true },
    duration: Number
  },
  reason: String,
  symptoms: [String],
  notes: String,
  pricing: {
    consultationFee: { type: Number, required: true },
    additionalCharges: Number,
    discount: { type: Number, default: 0 },
    couponCode: String,
    totalAmount: Number,
    tax: Number,
    finalAmount: Number
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially_paid', 'refunded'],
    default: 'pending'
  },
  teleconsultation: {
    meetingLink: String,
    meetingId: String,
    duration: Number,
    recordingUrl: String,
    startedAt: Date,
    endedAt: Date
  },
  reminders: [{
    channel: { type: String, enum: ['sms', 'email', 'push', 'whatsapp'] },
    scheduledAt: Date,
    sentAt: Date,
    status: { type: String, enum: ['pending', 'sent', 'failed'] }
  }],
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelledAt: Date,
  cancelledReason: String,
  refundAmount: Number,
  completedAt: Date,
  followUpDate: Date
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ doctorId: 1, 'slot.start': 1 });
appointmentSchema.index({ patientId: 1, status: 1 });
appointmentSchema.index({ clinicId: 1, status: 1, 'slot.start': 1 });

// Pre-save middleware
appointmentSchema.pre('save', function(next) {
  // Calculate tax and final amount (18% GST)
  if (this.pricing.consultationFee) {
    this.pricing.tax = (this.pricing.consultationFee * 0.18).toFixed(2);
    this.pricing.finalAmount = (parseFloat(this.pricing.consultationFee) + parseFloat(this.pricing.tax) - (this.pricing.discount || 0)).toFixed(2);
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);