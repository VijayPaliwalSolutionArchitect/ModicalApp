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

// Test data
const testData = {
  "clinic": {
    "_id": "clinic_001",
    "name": "Shivam Medical Clinic",
    "slug": "shivam-medical-clinic",
    "address": {
      "street": "123 Main Road",
      "city": "Gunnaur",
      "state": "Uttar Pradesh",
      "country": "India",
      "pincode": "209801"
    },
    "contactPhone": "+919876543210",
    "contactEmail": "contact@shivamclinic.com",
    "subscription": {
      "planId": "pro",
      "status": "active"
    }
  },
  "doctors": [
    {
      "_id": "doctor_001",
      "email": "dr.ajay@shivamclinic.com",
      "phone": "+919123456701",
      "password": "Doctor@123",
      "role": "doctor",
      "name": {
        "first": "Ajay",
        "last": "Sharma",
        "display": "Dr. Ajay Sharma"
      },
      "doctorProfile": {
        "specialties": ["General Medicine"],
        "licenseNumber": "MCI-12001",
        "qualifications": ["MBBS", "MD"],
        "bio": "17 years of experience in General Medicine",
        "consultationFee": 450,
        "teleconsultationFee": 350,
        "rating": 4.7,
        "totalReviews": 120
      }
    },
    {
      "_id": "doctor_002",
      "email": "dr.anita@shivamclinic.com",
      "phone": "+919123456702",
      "password": "Doctor@123",
      "role": "doctor",
      "name": {
        "first": "Anita",
        "last": "Verma",
        "display": "Dr. Anita Verma"
      },
      "doctorProfile": {
        "specialties": ["Cardiology"],
        "licenseNumber": "MCI-12002",
        "qualifications": ["MBBS", "MD"],
        "bio": "18 years of experience in Cardiology",
        "consultationFee": 600,
        "teleconsultationFee": 450,
        "rating": 4.8,
        "totalReviews": 180
      }
    }
  ],
  "patients": [
    {
      "_id": "patient_001",
      "userId": "user_p001",
      "email": "patient1@example.com",
      "phone": "+919184949371",
      "password": "Patient@123",
      "patientNumber": "PAT001",
      "name": {
        "first": "Rajesh",
        "last": "Kumar",
        "display": "Rajesh Kumar"
      },
      "demographics": {
        "dob": "1990-05-20",
        "gender": "male",
        "bloodGroup": "A+",
        "heightCm": 170,
        "weightKg": 70
      },
      "contact": {
        "phone": "+919184949371",
        "email": "patient1@example.com",
        "address": {
          "street": "55 Gandhi Road",
          "city": "Gunnaur",
          "state": "Uttar Pradesh",
          "pincode": "209801"
        }
      }
    },
    {
      "_id": "patient_002",
      "userId": "user_p002",
      "email": "patient2@example.com",
      "phone": "+919184949372",
      "password": "Patient@123",
      "patientNumber": "PAT002",
      "name": {
        "first": "Priya",
        "last": "Sharma",
        "display": "Priya Sharma"
      },
      "demographics": {
        "dob": "1995-03-15",
        "gender": "female",
        "bloodGroup": "B+",
        "heightCm": 160,
        "weightKg": 55
      },
      "contact": {
        "phone": "+919184949372",
        "email": "patient2@example.com",
        "address": {
          "street": "23 Gandhi Road",
          "city": "Gunnaur",
          "state": "Uttar Pradesh",
          "pincode": "209801"
        }
      }
    }
  ]
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding data...');

    // Create Clinic
    const clinic = await Clinic.create({
      ...testData.clinic,
      _id: new mongoose.Types.ObjectId()
    });
    console.log('✓ Clinic created');

    // Create Doctors
    const doctorIds = [];
    for (const doctorData of testData.doctors) {
      const user = await User.create({
        email: doctorData.email,
        phone: doctorData.phone,
        passwordHash: doctorData.password,
        role: doctorData.role,
        name: doctorData.name,
        clinicId: clinic._id,
        doctorProfile: doctorData.doctorProfile,
        isActive: true,
        isEmailVerified: true
      });
      doctorIds.push(user._id);
      console.log(`✓ Doctor created: ${doctorData.name.display}`);
    }

    // Create Patients
    const patientIds = [];
    for (const patientData of testData.patients) {
      // Create user for patient
      const user = await User.create({
        email: patientData.email,
        phone: patientData.phone,
        passwordHash: patientData.password,
        role: 'patient',
        name: patientData.name,
        clinicId: clinic._id,
        isActive: true
      });

      // Create patient record
      const patient = await Patient.create({
        userId: user._id,
        clinicId: clinic._id,
        patientNumber: patientData.patientNumber,
        demographics: patientData.demographics,
        contact: patientData.contact
      });

      // Link patient profile to user
      user.patientProfile = { patientId: patient._id };
      await user.save();

      patientIds.push(patient._id);
      console.log(`✓ Patient created: ${patientData.name.display}`);
    }

    // Create sample appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const appointment = await Appointment.create({
      clinicId: clinic._id,
      doctorId: doctorIds[0],
      patientId: patientIds[0],
      appointmentNumber: 'APPT001',
      type: 'in_clinic',
      status: 'scheduled',
      slot: {
        start: tomorrow,
        end: new Date(tomorrow.getTime() + 30 * 60000),
        duration: 30
      },
      reason: 'Regular Checkup',
      symptoms: ['Fever', 'Headache'],
      pricing: {
        consultationFee: 450
      },
      paymentStatus: 'pending'
    });
    console.log('✓ Sample appointment created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Doctor: dr.ajay@shivamclinic.com / Doctor@123');
    console.log('Patient: patient1@example.com / Patient@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const cleanDB = async () => {
  try {
    await connectDB();

    console.log('Cleaning database...');

    await User.deleteMany({});
    await Clinic.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});

    console.log('✅ Database cleaned successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
};

// Run based on command
const command = process.argv[2];

if (command === 'seed') {
  seedData();
} else if (command === 'clean') {
  cleanDB();
} else {
  console.log('Usage:');
  console.log('  npm run seed       - Seed the database with test data');
  console.log('  npm run seed:clean - Clean all data from database');
  process.exit(1);
}