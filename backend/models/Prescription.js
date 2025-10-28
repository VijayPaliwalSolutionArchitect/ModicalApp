const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  prescriptionNumber: { type: String, unique: true },
  items: [{
    drugName: String,
    genericName: String,
    dose: String,
    frequency: String,
    duration: String,
    quantity: String,
    instructions: String,
    morning: Boolean,
    afternoon: Boolean,
    evening: Boolean,
    night: Boolean,
    beforeFood: Boolean,
    afterFood: Boolean
  }],
  diagnosis: String,
  notes: String,
  issuedAt: { type: Date, default: Date.now },
  validUntil: Date,
  pdfUrl: String,
  qrCode: String,
  refillAllowed: { type: Boolean, default: false },
  refillCount: { type: Number, default: 0 },
  maxRefills: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'expired', 'refilled', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
prescriptionSchema.index({ patientId: 1, status: 1 });
prescriptionSchema.index({ patientId: 1, issuedAt: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);