const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Doctor/Admin)
router.get('/', protect, authorize('doctor', 'clinic_admin', 'receptionist'), async (req, res) => {
  try {
    const query = req.user.clinicId ? { clinicId: req.user.clinicId } : {};

    const patients = await Patient.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/patients/me
// @desc    Get current patient profile
// @access  Private (Patient)
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone avatarUrl');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'name email phone avatarUrl');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update fields
    const updatableFields = ['demographics', 'contact', 'emergencyContacts', 'allergies', 'chronicConditions', 'socialHistory', 'insurance', 'preferences'];
    
    updatableFields.forEach(field => {
      if (req.body[field]) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();

    res.json(patient);
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;