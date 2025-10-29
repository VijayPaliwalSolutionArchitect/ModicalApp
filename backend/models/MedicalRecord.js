const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
    index: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
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
  visitDate: { type: Date, required: true, index: true },
  visitType: {
    type: String,
    enum: ['consultation', 'follow_up', 'emergency', 'routine_checkup']
  },
  vitals: {
    bpSystolic: Number,
    bpDiastolic: Number,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    spo2: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    recordedAt: Date
  },
  complaints: [String],
  examination: {
    general: String,
    systemic: String,
    notes: String
  },
  diagnosis: [{
    code: String,
    name: String,
    type: { type: String, enum: ['primary', 'secondary', 'differential'] },
    notes: String
  }],
  notes: String,
  privateNotes: String,
  status: {
    type: String,
    enum: ['draft', 'finalized', 'amended'],
    default: 'finalized'
  }
}, {
  timestamps: true
});

// Indexes
medicalRecordSchema.index({ patientId: 1, visitDate: -1 });
medicalRecordSchema.index({ doctorId: 1, visitDate: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);