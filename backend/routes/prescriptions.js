const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const { protect } = require('../middleware/auth');

// @route   GET /api/prescriptions
// @desc    Get all prescriptions (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else if (req.user.role === 'patient') {
      const patientId = req.user.patientProfile?.patientId;
      if (!patientId) {
        return res.status(400).json({ message: 'Patient profile not found' });
      }
      query.patientId = patientId;
    }

    const prescriptions = await Prescription.find(query)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId')
      .sort({ issuedAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/prescriptions/:id
// @desc    Get prescription by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/prescriptions
// @desc    Create new prescription
// @access  Private (Doctor)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    const prescriptionNumber = `RX${String(Date.now()).slice(-8)}`;

    const prescription = await Prescription.create({
      ...req.body,
      doctorId: req.user._id,
      clinicId: req.user.clinicId,
      prescriptionNumber
    });

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('doctorId', 'name email doctorProfile')
      .populate('patientId');

    res.status(201).json(populatedPrescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;