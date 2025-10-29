const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Load models
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for comprehensive seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Comprehensive test data
const specialties = [
  'General Medicine', 'Cardiology', 'Dermatology', 'Orthopedics',
  'Pediatrics', 'Gynecology', 'ENT', 'Neurology', 'Dentistry', 'Psychiatry'
];

const symptoms = [
  'Fever', 'Headache', 'Cough', 'Back Pain', 'Fatigue', 
  'Nausea', 'Chest Pain', 'Shortness of Breath', 'Dizziness'
];

const medications = [
  { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily' },
  { name: 'Amoxicillin', dosage: '250mg', frequency: 'Thrice daily' },
  { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily' },
  { name: 'Aspirin', dosage: '100mg', frequency: 'Once daily' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
];

const chronicConditions = [
  { name: 'Hypertension', code: 'I10' },
  { name: 'Type 2 Diabetes', code: 'E11' },
  { name: 'Asthma', code: 'J45' },
  { name: 'Arthritis', code: 'M19' },
];

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rahul', 'Pooja', 'Sanjay', 'Neha', 
  'Arjun', 'Kavya', 'Rohan', 'Divya', 'Karan', 'Ritu', 'Arun', 'Meera', 'Suresh', 'Lakshmi'];

const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Mehta', 'Gupta', 'Verma', 'Rao', 'Joshi'];

const generateDoctors = (clinicId) => {
  return specialties.map((specialty, index) => ({
    email: `dr.${specialty.toLowerCase().replace(/\s+/g, '')}${index}@shivamclinic.com`,
    phone: `+9191234567${String(index).padStart(2, '0')}`,
    password: 'Doctor@123',
    role: 'doctor',
    name: {
      first: firstNames[index],
      last: lastNames[index % 10],
      display: `Dr. ${firstNames[index]} ${lastNames[index % 10]}`
    },
    clinicId,
    doctorProfile: {
      specialties: [specialty],
      licenseNumber: `MCI-120${String(index).padStart(2, '0')}`,
      qualifications: index % 2 === 0 ? ['MBBS', 'MD'] : ['MBBS', 'MS'],
      bio: `${15 + index} years of experience in ${specialty}`,
      consultationFee: 400 + (index * 50),
      teleconsultationFee: 300 + (index * 40),
      workingHours: [
        { weekday: 1, from: '09:00', to: '18:00', breaks: [{ from: '13:00', to: '14:00' }] },
        { weekday: 2, from: '09:00', to: '18:00', breaks: [{ from: '13:00', to: '14:00' }] },
        { weekday: 3, from: '09:00', to: '18:00', breaks: [{ from: '13:00', to: '14:00' }] },
        { weekday: 4, from: '09:00', to: '18:00', breaks: [{ from: '13:00', to: '14:00' }] },
        { weekday: 5, from: '09:00', to: '18:00', breaks: [{ from: '13:00', to: '14:00' }] },
      ],
      rating: 4.5 + (Math.random() * 0.5),
      totalReviews: 80 + Math.floor(Math.random() * 120)
    },
    isActive: true,
    isEmailVerified: true
  }));
};

const generatePatients = (clinicId, count = 20) => {
  const patients = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const hasChronicCondition = i % 3 === 0;
    
    patients.push({
      email: `patient${i + 1}@example.com`,
      phone: `+9191849493${String(70 + i).padStart(2, '0')}`,
      password: 'Patient@123',
      patientNumber: `PAT${String(i + 1).padStart(4, '0')}`,
      name: {
        first: firstName,
        last: lastName,
        display: `${firstName} ${lastName}`
      },
      clinicId,
      demographics: {
        dob: new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        gender: i % 2 === 0 ? 'male' : 'female',
        bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][i % 8],
        heightCm: 150 + Math.floor(Math.random() * 30),
        weightKg: 50 + Math.floor(Math.random() * 40)
      },
      contact: {
        phone: `+9191849493${String(70 + i).padStart(2, '0')}`,
        email: `patient${i + 1}@example.com`,
        address: {
          street: `${i + 10} Gandhi Road`,
          city: 'Gunnaur',
          state: 'Uttar Pradesh',
          pincode: '209801'
        }
      },
      chronicConditions: hasChronicCondition ? [
        {
          ...chronicConditions[i % chronicConditions.length],
          diagnosedDate: new Date(2015 + Math.floor(Math.random() * 8), 0, 1),
          isActive: true
        }
      ] : [],
      allergies: i % 5 === 0 ? [{
        substance: 'Penicillin',
        reaction: 'Rash',
        severity: 'moderate'
      }] : []
    });
  }
  return patients;
};

const seedComprehensive = async () => {
  try {
    await connectDB();

    console.log('🧹 Cleaning existing data...');
    await User.deleteMany({});
    await Clinic.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Notification.deleteMany({});
    console.log('✓ Database cleaned');

    console.log('\n📦 Creating comprehensive test data...\n');

    // 1. Create Clinic
    const clinic = await Clinic.create({
      name: 'Shivam Medical Clinic',
      slug: 'shivam-medical-clinic',
      address: {
        street: '123 Main Road',
        city: 'Gunnaur',
        state: 'Uttar Pradesh',
        country: 'India',
        pincode: '209801'
      },
      contactPhone: '+919876543210',
      contactEmail: 'contact@shivamclinic.com',
      subscription: {
        planId: 'pro',
        status: 'active'
      },
      features: {
        maxDoctors: 20,
        maxPatients: 1000,
        maxAppointmentsPerMonth: 5000
      }
    });
    console.log('✓ Clinic created');

    // 2. Create Doctors
    const doctorData = generateDoctors(clinic._id);
    const doctorIds = [];
    
    for (const docData of doctorData) {
      const user = await User.create({
        email: docData.email,
        phone: docData.phone,
        passwordHash: docData.password,
        role: docData.role,
        name: docData.name,
        clinicId: docData.clinicId,
        doctorProfile: docData.doctorProfile,
        isActive: docData.isActive,
        isEmailVerified: docData.isEmailVerified
      });
      doctorIds.push(user._id);
    }
    console.log(`✓ ${doctorIds.length} Doctors created`);

    // 3. Create Patients
    const patientData = generatePatients(clinic._id, 20);
    const patientIds = [];
    
    for (const patData of patientData) {
      // Create user
      const user = await User.create({
        email: patData.email,
        phone: patData.phone,
        passwordHash: patData.password,
        role: 'patient',
        name: patData.name,
        clinicId: patData.clinicId,
        isActive: true
      });

      // Create patient record
      const patient = await Patient.create({
        userId: user._id,
        clinicId: patData.clinicId,
        patientNumber: patData.patientNumber,
        demographics: patData.demographics,
        contact: patData.contact,
        chronicConditions: patData.chronicConditions,
        allergies: patData.allergies
      });

      // Link to user
      user.patientProfile = { patientId: patient._id };
      await user.save();
      
      patientIds.push(patient._id);
    }
    console.log(`✓ ${patientIds.length} Patients created`);

    // 4. Create Appointments (50+)
    const appointmentTypes = ['in_clinic', 'teleconsultation', 'home_visit'];
    const statuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];
    
    let appointmentCount = 0;
    
    for (let i = 0; i < 60; i++) {
      const doctor = doctorIds[i % doctorIds.length];
      const patient = patientIds[i % patientIds.length];
      const type = appointmentTypes[i % 3];
      
      // Mix of past and future appointments
      const daysOffset = i < 30 ? -(30 - i) : (i - 30);
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + daysOffset);
      appointmentDate.setHours(9 + (i % 8), 0, 0, 0);
      
      const endDate = new Date(appointmentDate.getTime() + 30 * 60000);
      
      // Past appointments are completed, future are scheduled/confirmed
      const status = daysOffset < 0 
        ? (i % 10 === 0 ? 'cancelled' : 'completed')
        : (i % 3 === 0 ? 'confirmed' : 'scheduled');
      
      const doctorUser = await User.findById(doctor);
      const consultationFee = doctorUser.doctorProfile.consultationFee;
      
      await Appointment.create({
        clinicId: clinic._id,
        doctorId: doctor,
        patientId: patient,
        appointmentNumber: `APPT${String(appointmentCount + 1).padStart(4, '0')}`,
        type,
        status,
        slot: {
          start: appointmentDate,
          end: endDate,
          duration: 30
        },
        reason: i % 3 === 0 ? 'Regular Checkup' : i % 3 === 1 ? 'Follow-up' : 'Consultation',
        symptoms: [symptoms[i % symptoms.length], symptoms[(i + 1) % symptoms.length]],
        pricing: {
          consultationFee
        },
        paymentStatus: status === 'completed' ? 'paid' : 'pending',
        completedAt: status === 'completed' ? appointmentDate : null
      });
      
      appointmentCount++;
    }
    console.log(`✓ ${appointmentCount} Appointments created`);

    // 5. Create Prescriptions
    const prescriptionCount = 0;
    const completedAppointments = await Appointment.find({ status: 'completed' }).limit(25);
    
    for (const apt of completedAppointments) {
      const items = [];
      const medCount = 2 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < medCount; j++) {
        const med = medications[j % medications.length];
        items.push({
          drugName: med.name,
          dose: med.dosage,
          frequency: med.frequency,
          duration: '7 days',
          instructions: 'Take after meals',
          morning: j % 2 === 0,
          evening: true,
          afterFood: true
        });
      }
      
      await Prescription.create({
        clinicId: clinic._id,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId: apt._id,
        prescriptionNumber: `RX${String(Date.now()).slice(-8)}${Math.random().toString(36).substr(2, 4)}`,
        items,
        diagnosis: 'As discussed',
        issuedAt: apt.completedAt,
        status: 'active',
        refillAllowed: Math.random() > 0.5
      });
    }
    console.log(`✓ ${completedAppointments.length} Prescriptions created`);

    // 6. Create Notifications
    let notifCount = 0;
    for (const patientId of patientIds.slice(0, 10)) {
      const patient = await Patient.findById(patientId).populate('userId');
      
      // Appointment reminder
      await Notification.create({
        userId: patient.userId._id,
        clinicId: clinic._id,
        type: 'appointment',
        title: 'Upcoming Appointment',
        body: 'You have an appointment tomorrow at 10:00 AM',
        priority: 'high',
        read: Math.random() > 0.5
      });
      
      // Medication reminder
      await Notification.create({
        userId: patient.userId._id,
        clinicId: clinic._id,
        type: 'reminder',
        title: 'Medication Reminder',
        body: 'Time to take your medication',
        priority: 'medium',
        read: Math.random() > 0.3
      });
      
      notifCount += 2;
    }
    console.log(`✓ ${notifCount} Notifications created`);

    console.log('\n✅ Comprehensive database seeding completed!\n');
    console.log('📊 Summary:');
    console.log(`   - Clinic: 1`);
    console.log(`   - Doctors: ${doctorIds.length} (${specialties.join(', ')})`);
    console.log(`   - Patients: ${patientIds.length}`);
    console.log(`   - Appointments: ${appointmentCount}`);
    console.log(`   - Prescriptions: ${completedAppointments.length}`);
    console.log(`   - Notifications: ${notifCount}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Doctor: dr.generalmedicine0@shivamclinic.com / Doctor@123');
    console.log('   Patient: patient1@example.com / Patient@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run
seedComprehensive();
