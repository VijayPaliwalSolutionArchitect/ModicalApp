const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/medical-records
// @desc    Get medical records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      const patientId = req.user.patientProfile?.patientId;
      if (!patientId) {
        return res.status(400).json({ message: 'Patient profile not found' });
      }
      query.patientId = patientId;
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else if (req.user.clinicId) {
      query.clinicId = req.user.clinicId;
    }

    if (req.query.patientId) {
      query.patientId = req.query.patientId;
    }

    const records = await MedicalRecord.find(query)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId')
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get medical record by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId')
      .populate('appointmentId');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/medical-records
// @desc    Create medical record
// @access  Private (Doctor)
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      doctorId: req.user._id,
      clinicId: req.user.clinicId
    });

    const populatedRecord = await MedicalRecord.findById(record._id)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId');

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/medical-records/patient/:patientId/timeline
// @desc    Get patient medical timeline
// @access  Private
router.get('/patient/:patientId/timeline', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name doctorProfile.specialties')
      .sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;