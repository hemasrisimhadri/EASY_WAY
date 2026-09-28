const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const customerCare = process.env.EASYWAY_CUSTOMER_CARE_PHONE
    ? process.env.EASYWAY_CUSTOMER_CARE_PHONE
    : 'Coming Soon';

  res.status(200).json({
    success: true,
    data: {
      appName: 'EASYWAY',
      tagline: 'Healthcare Made Easy',
      location: 'Vijayawada, Andhra Pradesh, India',
      email: 'simhadrirajagmail.com',
      customerCarePhone: customerCare
    }
  });
});

module.exports = router;
