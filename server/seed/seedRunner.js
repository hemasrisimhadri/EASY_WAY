const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Department = require('../models/Department');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { departmentsData, hospitalsData, doctorsData } = require('./seedData');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Starting EasyWay database seed...');

    // 1. Seed or update Departments
    const deptMap = {};
    for (const d of departmentsData) {
      let dept = await Department.findOne({ name: d.name });
      if (!dept) {
        dept = await Department.create(d);
        console.log(`[Seed] Created Department: ${dept.name}`);
      }
      deptMap[dept.name] = dept._id;
    }

    // 2. Seed or update Hospitals
    const hospMap = {};
    for (const h of hospitalsData) {
      let hospital = await Hospital.findOne({ name: h.name });
      const deptIds = (h.departmentNames || []).map((name) => deptMap[name]).filter(Boolean);

      if (!hospital) {
        hospital = await Hospital.create({
          name: h.name,
          address: h.address,
          city: h.city || 'Vijayawada',
          state: h.state || 'Andhra Pradesh',
          pincode: h.pincode,
          phone: h.phone,
          emergencyPhone: h.emergencyPhone || '',
          emergencyAvailable: h.emergencyAvailable || false,
          website: h.website || '',
          directionsUrl: h.directionsUrl || '',
          source: h.source || 'Official hospital website',
          lastVerified: h.lastVerified || '2026-09-28',
          status: h.status || 'active',
          departments: deptIds
        });
        console.log(`[Seed] Created Hospital: ${hospital.name}`);
      } else {
        // ensure department associations are intact
        hospital.departments = deptIds;
        hospital.emergencyAvailable = h.emergencyAvailable;
        hospital.emergencyPhone = h.emergencyPhone || '';
        await hospital.save();
      }
      hospMap[hospital.name] = hospital._id;
    }

    // 3. Seed Doctors
    for (const doc of doctorsData) {
      const hospitalId = hospMap[doc.hospitalName];
      const deptId = deptMap[doc.departmentName];

      if (hospitalId && deptId) {
        let doctor = await Doctor.findOne({
          name: doc.name,
          hospital: hospitalId
        });

        if (!doctor) {
          doctor = await Doctor.create({
            name: doc.name,
            specialty: doc.specialty,
            qualification: doc.qualification,
            hospital: hospitalId,
            department: deptId,
            experience: doc.experience,
            availableDays: doc.availableDays,
            availableSlots: doc.availableSlots,
            source: doc.source,
            lastVerified: doc.lastVerified,
            status: doc.status
          });
          console.log(`[Seed] Created Doctor: ${doctor.name} at ${doc.hospitalName}`);
        }
      }
    }

    // 4. Seed Admin user
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@easyway.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345EasyWay';
    const adminName = process.env.ADMIN_NAME || 'EasyWay Administrator';
    const adminPhone = process.env.ADMIN_PHONE || '0866-2488888';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed] Created Admin User: ${admin.email}`);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
    }

    // 5. Seed a demo Patient user
    const patientEmail = 'patient@easyway.com';
    let demoPatient = await User.findOne({ email: patientEmail });
    if (!demoPatient) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Patient@12345', salt);
      demoPatient = await User.create({
        name: 'Simhadri Raja',
        email: patientEmail,
        phone: '9876543210',
        password: hashedPassword,
        role: 'patient'
      });
      console.log(`[Seed] Created Demo Patient User: ${demoPatient.email}`);
    }

    console.log('✅ [Seed] Database seeding completed successfully.');
    return true;
  } catch (err) {
    console.error('❌ [Seed] Error seeding database:', err);
    throw err;
  }
};

// Allow running directly: node server/seed/seedRunner.js
if (require.main === module) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
  const connectDB = require('../config/db');

  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('Seed execution finished. Exiting process.');
      process.exit(0);
    } catch (e) {
      console.error('Seed process failed:', e);
      process.exit(1);
    }
  })();
}

module.exports = seedDatabase;
