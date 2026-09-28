const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('==================================================');
  console.log('🧪 RUNNING EASYWAY FULL-STACK SUITE VERIFICATION');
  console.log('==================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, extraInfo = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${extraInfo}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert(health.status === 200 && health.body.success, 'GET /api/health returns operational');

    // 2. Config check
    const config = await request('/config');
    assert(
      config.status === 200 && config.body.data.customerCarePhone === 'Coming Soon',
      'GET /api/config returns "Customer Care: Coming Soon"'
    );

    // 3. Departments check
    const depts = await request('/departments');
    assert(
      depts.status === 200 && depts.body.data.length >= 12,
      `GET /api/departments returns active categories (Count: ${depts.body?.data?.length})`
    );
    const cardiology = depts.body.data.find((d) => d.name === 'Cardiology');
    assert(!!cardiology, 'Department "Cardiology" found in database');

    // 4. Hospitals check
    const hosps = await request('/hospitals');
    assert(
      hosps.status === 200 && hosps.body.data.length >= 18,
      `GET /api/hospitals returns Vijayawada hospitals (Count: ${hosps.body?.data?.length})`
    );
    const ramesh = hosps.body.data.find((h) => h.name.includes('Aster Ramesh'));
    assert(!!ramesh, 'Hospital "Aster Ramesh Hospital" found in database');

    // 5. Emergency filter
    const emergencyHosps = await request('/hospitals?emergencyOnly=true');
    assert(
      emergencyHosps.status === 200 && emergencyHosps.body.data.every((h) => h.emergencyAvailable),
      'GET /api/hospitals?emergencyOnly=true returns only verified 24/7 facilities'
    );

    // 6. Doctors check
    const docs = await request('/doctors');
    assert(
      docs.status === 200 && docs.body.data.length >= 8,
      `GET /api/doctors returns verified medical specialists (Count: ${docs.body?.data?.length})`
    );
    const doctorObj = docs.body.data[0];

    // 7. Doctor details with date slots
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const testDate = tomorrow.toISOString().split('T')[0];

    const docDetail = await request(`/doctors/${doctorObj._id}?date=${testDate}`);
    assert(
      docDetail.status === 200 && docDetail.body.data.slotsStatus.length > 0,
      'GET /api/doctors/:id returns real-time slot status for date'
    );

    // 8. Register new patient
    const randomTestEmail = `tester_${Date.now()}@easyway.com`;
    const regRes = await request('/auth/register', 'POST', {
      name: 'Priya Sharma',
      email: randomTestEmail,
      phone: '9848012345',
      password: 'Password@123',
      confirmPassword: 'Password@123'
    });
    assert(
      regRes.status === 201 && !!regRes.body.data.token,
      'POST /api/auth/register creates user and returns JWT token'
    );
    const patientToken = regRes.body.data.token;

    // 9. Login patient
    const loginRes = await request('/auth/login', 'POST', {
      email: randomTestEmail,
      password: 'Password@123'
    });
    assert(
      loginRes.status === 200 && loginRes.body.data.user.role === 'patient',
      'POST /api/auth/login logs in patient and validates credentials'
    );

    // 10. Patient Auth Check
    const meRes = await request('/auth/me', 'GET', null, patientToken);
    assert(
      meRes.status === 200 && meRes.body.data.email === randomTestEmail,
      'GET /api/auth/me returns authenticated patient profile'
    );

    // 11. Book an appointment
    const targetSlot = doctorObj.availableSlots[0] || '10:00 AM';
    const bookRes = await request(
      '/appointments',
      'POST',
      {
        patientName: 'Priya Sharma',
        patientAge: 28,
        patientGender: 'Female',
        patientPhone: '9848012345',
        patientEmail: randomTestEmail,
        hospital: doctorObj.hospital._id,
        doctor: doctorObj._id,
        department: doctorObj.department._id,
        date: testDate,
        time: targetSlot,
        reason: 'Periodic health examination and consultation'
      },
      patientToken
    );

    assert(
      bookRes.status === 201 && bookRes.body.data.appointmentId.startsWith('EASY-2026-'),
      `POST /api/appointments creates booking with unique ID: ${bookRes.body?.data?.appointmentId}`
    );
    const createdAppointment = bookRes.body.data;

    // 12. Prevent duplicate booking on same slot (Section 15)
    const duplicateRes = await request(
      '/appointments',
      'POST',
      {
        patientName: 'Another Patient',
        patientAge: 40,
        patientGender: 'Male',
        patientPhone: '9988776655',
        patientEmail: 'another@patient.com',
        hospital: doctorObj.hospital._id,
        doctor: doctorObj._id,
        department: doctorObj.department._id,
        date: testDate,
        time: targetSlot,
        reason: 'Duplicate check test'
      },
      patientToken
    );
    assert(
      duplicateRes.status === 409,
      'POST /api/appointments strictly blocks duplicate booking for identical doctor/date/time'
    );

    // 13. My Appointments
    const myAppsRes = await request('/appointments/my', 'GET', null, patientToken);
    assert(
      myAppsRes.status === 200 && myAppsRes.body.data.some((a) => a._id === createdAppointment._id),
      'GET /api/appointments/my lists booked appointments for logged in patient'
    );

    // 14. Admin Login
    const adminLoginRes = await request('/auth/login', 'POST', {
      email: 'admin@easyway.com',
      password: 'Admin@12345EasyWay'
    });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.body.data.user.role === 'admin',
      'POST /api/auth/login verifies Administrator credentials'
    );
    const adminToken = adminLoginRes.body.data.token;

    // 15. Admin Metrics
    const metricsRes = await request('/admin/metrics', 'GET', null, adminToken);
    assert(
      metricsRes.status === 200 && metricsRes.body.data.totalAppointments >= 1,
      'GET /api/admin/metrics returns real-time dashboard analytics'
    );

    // 16. Admin Update Status
    const statusUpdateRes = await request(
      `/appointments/${createdAppointment._id}/status`,
      'PUT',
      { status: 'Completed', notes: 'Consultation conducted successfully.' },
      adminToken
    );
    assert(
      statusUpdateRes.status === 200 && statusUpdateRes.body.data.status === 'Completed',
      'PUT /api/appointments/:id/status updates status to "Completed"'
    );

    // 17. Patient Cancel Appointment test
    // Book a second appointment to test cancellation
    const nextSlot = doctorObj.availableSlots[1] || '10:30 AM';
    const bookSecondRes = await request(
      '/appointments',
      'POST',
      {
        patientName: 'Priya Sharma',
        patientAge: 28,
        patientGender: 'Female',
        patientPhone: '9848012345',
        patientEmail: randomTestEmail,
        hospital: doctorObj.hospital._id,
        doctor: doctorObj._id,
        department: doctorObj.department._id,
        date: testDate,
        time: nextSlot,
        reason: 'Cancellation test'
      },
      patientToken
    );

    const cancelRes = await request(
      `/appointments/${bookSecondRes.body.data._id}/cancel`,
      'PUT',
      { cancellationReason: 'Change in schedule' },
      patientToken
    );
    assert(
      cancelRes.status === 200 && cancelRes.body.data.status === 'Cancelled',
      'PUT /api/appointments/:id/cancel allows patient cancellation'
    );

    // 18. Security check: unauthenticated request blocked
    const unauthRes = await request('/appointments/my', 'GET', null, null);
    assert(
      unauthRes.status === 401,
      'Security: Unauthenticated request to /api/appointments/my correctly blocked with 401'
    );

    // 19. Security check: non-admin blocked from admin route
    const forbiddenRes = await request('/admin/metrics', 'GET', null, patientToken);
    assert(
      forbiddenRes.status === 403,
      'Security: Non-admin patient forbidden from accessing /api/admin/metrics with 403'
    );

    console.log('==================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('🌟 ALL 19 VERIFICATION TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal testing error:', err);
    process.exit(1);
  }
};

runTests();
