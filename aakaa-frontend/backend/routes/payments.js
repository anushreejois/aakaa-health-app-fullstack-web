const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Booking = require('../models/Booking');
const YogaBooking = require('../models/YogaBooking');
const YogaClass = require('../models/YogaClass');

const kotak_merchant_id = process.env.KOTAK_MERCHANT_ID || '';
const kotak_access_code = process.env.KOTAK_ACCESS_CODE || '';
const kotak_working_key = process.env.KOTAK_WORKING_KEY || ''; // Typically 32 chars for AES-256

// Helper for Kotak AES-256-CBC Encryption
function encryptKotakData(payload, workingKey) {
  try {
    const iv = crypto.randomBytes(16); 
    const key = Buffer.from(workingKey.padEnd(32, '0').slice(0, 32), 'utf-8'); 
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(payload, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('hex') + ':' + encrypted; 
  } catch (err) {
    console.error("Encryption error", err);
    return Buffer.from(payload).toString('base64'); // Fallback
  }
}

// Helper for Kotak AES-256-CBC Decryption
function decryptKotakData(encResponse, workingKey) {
  try {
    if (encResponse.includes(':')) {
      const parts = encResponse.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];
      const key = Buffer.from(workingKey.padEnd(32, '0').slice(0, 32), 'utf-8');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    // Fallback to base64 decode
    return Buffer.from(encResponse, 'base64').toString('utf8');
  } catch (err) {
    console.error("Decryption error", err);
    return null;
  }
}

// @route   POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  const { amount, bookingData, category } = req.body; 

  try {
    let pendingBookingId = null;

    if (category === 'therapy' && bookingData) {
      const newBooking = new Booking({
        ...bookingData,
        status: 'Pending Payment'
      });
      const saved = await newBooking.save();
      pendingBookingId = saved._id.toString();
    } else if (category === 'yoga' && bookingData) {
      const newYogaBooking = new YogaBooking({
        ...bookingData,
        status: 'Pending Payment'
      });
      const saved = await newYogaBooking.save();
      pendingBookingId = saved._id.toString();
    }

    const orderId = `kotak_${Date.now()}_${pendingBookingId || Math.random().toString(36).substring(7)}`;

    if (kotak_merchant_id && kotak_merchant_id !== '') {
      console.log("Using REAL Kotak Keys for PG integration.");
      
      const payloadString = `merchant_id=${kotak_merchant_id}&order_id=${orderId}&amount=${amount}&currency=INR&redirect_url=http://localhost:5173/payment-callback&cancel_url=http://localhost:5173/payment-callback`;
      
      const encRequest = encryptKotakData(payloadString, kotak_working_key);

      return res.json({
        mock: false,
        actionUrl: "https://pg.kotak.com/transaction.do", 
        formData: {
          encRequest: encRequest,
          access_code: kotak_access_code,
          merchant_id: kotak_merchant_id,
        },
        orderId: orderId,
        pendingBookingId
      });
    } else {
      console.warn("⚠️ Kotak API keys missing. Falling back to MOCK Payment Mode.");
      return res.json({
        mock: true,
        id: `order_mock_${Math.random().toString(36).substring(7)}`,
        amount: amount,
        currency: "INR",
        orderId: orderId,
        pendingBookingId
      });
    }

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/payments/verify
router.post('/verify', async (req, res) => {
  const { encResponse, mock, status, orderId, pendingBookingId, category } = req.body;

  try {
    let paymentVerified = false;

    if (mock || !kotak_merchant_id) {
      if (status === 'success') {
        paymentVerified = true;
      }
    } else {
      console.log("Verifying real Kotak response...");
      if (encResponse) {
        const decryptedStr = decryptKotakData(encResponse, kotak_working_key);
        if (decryptedStr && decryptedStr.includes(orderId)) {
          paymentVerified = true;
        }
      }
    }

    if (!paymentVerified) {
      if (pendingBookingId) {
        if (category === 'therapy') await Booking.findByIdAndUpdate(pendingBookingId, { status: 'cancelled' });
        else if (category === 'yoga') await YogaBooking.findByIdAndUpdate(pendingBookingId, { status: 'cancelled' });
      }
      return res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
    }

    let confirmedBooking = null;
    if (pendingBookingId) {
      if (category === 'therapy') {
        confirmedBooking = await Booking.findByIdAndUpdate(pendingBookingId, { status: 'confirmed' }, { new: true });
      } else if (category === 'yoga') {
        confirmedBooking = await YogaBooking.findByIdAndUpdate(pendingBookingId, { status: 'confirmed' }, { new: true });
        
        if (confirmedBooking && confirmedBooking.bookingType === 'class') {
           const yClass = await YogaClass.findById(confirmedBooking.classId);
           if (yClass) {
             yClass.bookedSpots += 1;
             await yClass.save();
           }
        }
      }
    }

    return res.json({ 
      status: 'success', 
      message: 'Payment verified successfully',
      booking: confirmedBooking 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
