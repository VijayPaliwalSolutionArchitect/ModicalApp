const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const query = { role: 'doctor', isActive: true };
    
    if (req.query.clinicId) {
      query.clinicId = req.query.clinicId;
    }

    if (req.query.specialty) {
      query['doctorProfile.specialties'] = req.query.specialty;
    }

    const doctors = await User.find(query)
      .select('-passwordHash')
      .populate('clinicId', 'name address')
      .sort({ 'name.display': 1 });

    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' })
      .select('-passwordHash')
      .populate('clinicId', 'name address contactPhone');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/doctors/:id/availability
// @desc    Get doctor availability
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();

    // Get working hours for the day
    const dayOfWeek = queryDate.getDay();
    const workingHours = doctor.doctorProfile.workingHours?.find(wh => wh.weekday === dayOfWeek);

    if (!workingHours) {
      return res.json({ available: false, slots: [] });
    }

    // Generate time slots (simplified - in production, check booked appointments)
    const slots = [];
    let currentTime = new Date(queryDate);
    const [startHour, startMin] = workingHours.from.split(':');
    const [endHour, endMin] = workingHours.to.split(':');
    
    currentTime.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
    const endTime = new Date(queryDate);
    endTime.setHours(parseInt(endHour), parseInt(endMin), 0, 0);

    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
      slots.push({
        start: new Date(currentTime),
        end: slotEnd,
        available: true
      });
      currentTime = slotEnd;
    }

    res.json({ available: true, workingHours, slots });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;