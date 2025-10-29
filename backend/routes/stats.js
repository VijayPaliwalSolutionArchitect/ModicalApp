const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const { protect } = require('../middleware/auth');

// @route   GET /api/stats/patient
// @desc    Get patient dashboard stats
// @access  Private (Patient)
router.get('/patient', protect, async (req, res) => {
  try {
    const patientId = req.user.patientProfile?.patientId;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient profile not found' });
    }

    // Total appointments
    const totalAppointments = await Appointment.countDocuments({
      patientId,
      status: { $nin: ['cancelled'] }
    });

    // Upcoming appointments
    const upcomingAppointments = await Appointment.countDocuments({
      patientId,
      status: { $in: ['scheduled', 'confirmed'] },
      'slot.start': { $gte: new Date() }
    });

    // Active prescriptions
    const activePrescriptions = await Prescription.countDocuments({
      patientId,
      status: 'active'
    });

    // Medical records
    const totalRecords = await MedicalRecord.countDocuments({ patientId });

    // Get patient details for allergies count
    const patient = await Patient.findById(patientId);
    const allergiesCount = patient?.allergies?.length || 0;

    res.json({
      appointments: upcomingAppointments,
      totalAppointments,
      medications: activePrescriptions,
      allergies: allergiesCount,
      records: totalRecords
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/stats/doctor
// @desc    Get doctor dashboard stats
// @access  Private (Doctor)
router.get('/doctor', protect, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments
    const todayAppointments = await Appointment.find({
      doctorId: req.user._id,
      'slot.start': { $gte: today, $lt: tomorrow }
    }).populate('patientId', 'demographics contact');

    // Total patients
    const totalPatients = await Patient.countDocuments({
      clinicId: req.user.clinicId
    });

    // This month's appointments
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyAppointments = await Appointment.countDocuments({
      doctorId: req.user._id,
      'slot.start': { $gte: firstDayOfMonth }
    });

    res.json({
      todayTotal: todayAppointments.length,
      todayNew: todayAppointments.filter(a => {
        const patient = a.patientId;
        return patient && new Date(patient.createdAt) > firstDayOfMonth;
      }).length,
      todayOld: todayAppointments.length - todayAppointments.filter(a => {
        const patient = a.patientId;
        return patient && new Date(patient.createdAt) > firstDayOfMonth;
      }).length,
      totalPatients,
      monthlyAppointments,
      upcomingToday: todayAppointments.filter(a => 
        new Date(a.slot.start) > new Date()
      ).length
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/stats/health-trends/:patientId
// @desc    Get patient health trends
// @access  Private
router.get('/health-trends/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      patientId: req.params.patientId
    })
      .select('visitDate vitals')
      .sort({ visitDate: 1 })
      .limit(30);

    const bpData = [];
    const weightData = [];
    const bmiData = [];

    records.forEach(record => {
      if (record.vitals) {
        if (record.vitals.bpSystolic && record.vitals.bpDiastolic) {
          bpData.push({
            date: record.visitDate,
            systolic: record.vitals.bpSystolic,
            diastolic: record.vitals.bpDiastolic
          });
        }
        if (record.vitals.weight) {
          weightData.push({
            date: record.visitDate,
            value: record.vitals.weight
          });
        }
        if (record.vitals.bmi) {
          bmiData.push({
            date: record.visitDate,
            value: record.vitals.bmi
          });
        }
      }
    });

    res.json({
      bloodPressure: bpData,
      weight: weightData,
      bmi: bmiData
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;