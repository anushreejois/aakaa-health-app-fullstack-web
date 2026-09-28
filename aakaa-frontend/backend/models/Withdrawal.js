const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
  amount: { type: Number, required: true },
  payoutMode: { type: String, enum: ['upi', 'bank'], required: true },
  therapistDetails: {
    upiId: { type: String },
    accountHolderName: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    accountNumber: { type: String }
  },
  status: { 
    type: String, 
    enum: ['pending', 'settled', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
