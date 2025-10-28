const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
  type: {
    type: String,
    enum: ['appointment', 'prescription', 'lab_report', 'payment', 'reminder', 'system', 'promotional'],
    required: true
  },
  title: { type: String, required: true },
  body: String,
  data: {
    relatedId: mongoose.Schema.Types.ObjectId,
    entity: String,
    action: String,
    deepLink: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: { type: Boolean, default: false, index: true },
  readAt: Date,
  delivered: {
    push: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  },
  deliveryStatus: {
    push: { status: String, error: String },
    sms: { status: String, error: String },
    email: { status: String, error: String },
    whatsapp: { status: String, error: String }
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);