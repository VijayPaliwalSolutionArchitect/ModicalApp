const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// @route   GET /api/appointments
// @desc    Get all appointments (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter based on role
    if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else if (req.user.role === 'patient') {
      const patientId = req.user.patientProfile?.patientId;
      if (!patientId) {
        return res.status(400).json({ message: 'Patient profile not found' });
      }
      query.patientId = patientId;
    } else if (req.user.clinicId) {
      query.clinicId = req.user.clinicId;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query['slot.start'] = {};
      if (req.query.startDate) {
        query['slot.start'].$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query['slot.start'].$lte = new Date(req.query.endDate);
      }
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name email phone doctorProfile')
      .populate('patientId')
      .populate('clinicId', 'name address contactPhone')
      .sort({ 'slot.start': 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name email phone doctorProfile')
      .populate('patientId')
      .populate('clinicId', 'name address contactPhone');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      clinicId,
      type,
      slot,
      reason,
      symptoms,
      consultationFee
    } = req.body;

    // Generate appointment number
    const appointmentNumber = `APPT${String(Date.now()).slice(-8)}`;

    const appointment = await Appointment.create({
      clinicId: clinicId || req.user.clinicId,
      doctorId,
      patientId: patientId || req.user.patientProfile?.patientId,
      requestedBy: req.user._id,
      appointmentNumber,
      type,
      status: 'scheduled',
      slot,
      reason,
      symptoms,
      pricing: {
        consultationFee
      },
      paymentStatus: 'pending'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name email phone doctorProfile')
      .populate('patientId')
      .populate('clinicId', 'name address');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        appointment[key] = req.body[key];
      }
    });

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name email phone doctorProfile')
      .populate('patientId')
      .populate('clinicId', 'name address');

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user._id;
    appointment.cancelledAt = new Date();
    appointment.cancelledReason = req.body.reason;

    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;