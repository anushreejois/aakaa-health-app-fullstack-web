import React from 'react';
import { CreditCard } from 'lucide-react';

export default function RefundCancellation() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-aakaa-green text-white rounded-2xl flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Refund & Cancellation Policy</h1>
            <p className="text-gray-500 font-medium mt-1">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 prose prose-green max-w-none">
          <p>
            At Aakaa Health, we strive to provide a seamless experience for booking therapy sessions and yoga classes. 
            However, we understand that plans can change. This policy outlines the terms under which cancellations 
            and refunds are processed.
          </p>

          <h3>1. Therapy Session Cancellations</h3>
          <ul>
            <li><strong>More than 24 hours notice:</strong> You can cancel or reschedule your therapy session up to 24 hours before the scheduled start time without any penalty. A full refund will be initiated to your original payment method.</li>
            <li><strong>Less than 24 hours notice:</strong> Cancellations made within 24 hours of the scheduled start time are generally non-refundable. Our therapists dedicate this time specifically for you.</li>
            <li><strong>No Shows:</strong> If you do not show up for your scheduled session without prior notice, no refund will be provided.</li>
          </ul>

          <h3>2. Yoga Class Cancellations</h3>
          <ul>
            <li><strong>More than 12 hours notice:</strong> You can cancel your yoga class booking up to 12 hours before the class begins for a full refund.</li>
            <li><strong>Less than 12 hours notice:</strong> Cancellations made within 12 hours of the class start time are non-refundable.</li>
          </ul>

          <h3>3. Therapist/Instructor Cancellations</h3>
          <p>
            In the rare event that a therapist or yoga instructor needs to cancel a session, you will be notified 
            immediately and provided with the option to either reschedule at your convenience or receive a full 100% refund.
          </p>

          <h3>4. Refund Processing Time</h3>
          <p>
            Approved refunds are typically processed within 5-7 business days. The exact time it takes for the funds 
            to appear in your account depends on your bank or payment provider (e.g., credit card company, UPI provider).
          </p>

          <h3>5. Contact for Disputes</h3>
          <p>
            If you believe you have been charged in error or have an extenuating circumstance regarding a cancellation, 
            please contact our support team at <strong>hello@aakaa.app</strong> within 48 hours of the scheduled session.
          </p>
        </div>
      </div>
    </div>
  );
}
