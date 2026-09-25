import React from 'react';
import { CreditCard } from 'lucide-react';

export default function RefundCancellation() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner Area */}
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto bg-aakaa-green text-white py-16 px-6 mb-16 rounded-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <CreditCard size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Refund & Cancellation Policy</h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose prose-lg prose-green max-w-none text-gray-700">
          <p className="text-xl font-medium text-gray-900 mb-10 leading-relaxed">
            At Aakaa Health, we strive to provide a seamless experience for booking therapy sessions and yoga classes. 
            However, we understand that plans can change. This policy outlines the terms under which cancellations 
            and refunds are processed.
          </p>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Cancellations & Rescheduling</h3>
              <ul className="space-y-3">
                <li>Fees paid for sessions booked with Aakaa Health are refundable if the booking is cancelled by you up to <strong>3 hours prior</strong> to the scheduled start time of the session.</li>
                <li>You can also reschedule the session up to <strong>3 hours prior</strong> to the scheduled start time without any penalty.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">No Shows & Late Cancellations</h3>
              <ul className="space-y-3">
                <li>If you fail to cancel or reschedule at least 3 hours prior to the session and do not attend at the scheduled time, you shall not be eligible for a refund of fees or rescheduling. Our professionals dedicate this time specifically for you.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Therapist/Instructor Cancellations</h3>
              <p className="leading-relaxed">
                In the rare event that a professional needs to cancel a session, you will be notified immediately and provided with the option to either reschedule at your convenience or receive a full 100% refund.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Refund Processing</h3>
              <ul className="space-y-3">
                <li>Refunds shall be made through the original mode of payment used during the booking.</li>
                <li>Approved refunds are typically processed within 5-7 business days, subject to the payment service provider's terms and conditions.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Contact for Disputes</h3>
              <p className="leading-relaxed">
                If you believe you have been charged in error or have an extenuating circumstance regarding a cancellation, 
                please contact our support team at <strong>hello@aakaa.app</strong> within 48 hours of the scheduled session.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
