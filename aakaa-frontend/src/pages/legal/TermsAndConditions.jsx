import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner Area */}
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto bg-aakaa-green text-white py-16 px-6 mb-16 rounded-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FileText size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Terms and Conditions</h1>

        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose prose-lg prose-green max-w-none text-gray-700">
          <p className="text-xl font-medium text-gray-900 mb-10 leading-relaxed">
            Welcome to Aakaa Health. These Terms and Conditions govern your access to and use of our website, 
            application, and services (collectively, the "Services"). By accessing or using the Services, 
            you agree to be bound by these Terms.
          </p>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">About Us</h3>
              <p className="leading-relaxed">
                Aakaa Health is a platform that connects users with mental health professionals and yoga instructors. 
                We provide a platform for scheduling and attending sessions.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Counseling Process (eCounseling)</h3>
              <ul className="space-y-3">
                <li>The first few sessions involve an evaluation of your needs, possibly including formal assessments.</li>
                <li>Based on this evaluation, a treatment plan or therapy goal is created.</li>
                <li>Sessions are usually scheduled once a week and are exclusively audio or video-based. Our platform does not support text messaging, chats, or emails for counseling sessions.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Scope and Limitations of Services</h3>
              <ul className="space-y-3">
                <li><strong>Not for Severe Cases:</strong> Online counseling is not suitable for severe thoughts of suicide, self-harm, or extreme mood swings. In such cases, you will be referred to a professional for face-to-face sessions.</li>
                <li><strong>Legal Proceedings:</strong> Aakaa Health professionals will not testify in court or any legal proceedings (such as divorce, custody, or lawsuits), and psychotherapy records cannot be requested for these purposes.</li>
                <li>Psychiatrist consultations are also available on our platform if required.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Technical Requirements</h3>
              <p className="leading-relaxed">
                For the best experience, we recommend using a desktop or laptop with a high-resolution camera, a functional microphone, and a strong internet connection. Ensure you grant the necessary permissions for the camera and microphone in your browser settings.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Emergencies</h3>
              <p className="leading-relaxed">
                Our counseling service is <strong>not</strong> designed for emergencies or crises. <strong>We do not provide emergency medical services.</strong> If you are experiencing a medical emergency or a mental health crisis, please call your local emergency services immediately or contact a crisis hotline. We cannot be designated as your personal emergency contact.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Cancellation and Refund Policy</h3>
              <ul className="space-y-3">
                <li><strong>Cancellations/Rescheduling:</strong> Must be done at least 3 hours prior to the scheduled session start time to be eligible for a refund or to reschedule.</li>
                <li><strong>No-shows:</strong> If you miss a session without canceling 3 hours prior, you will not receive a refund or the option to reschedule.</li>
                <li>Refunds are processed back to the original payment method and are subject to the terms of the payment service provider.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Grievance and Feedback</h3>
              <p className="leading-relaxed">
                If you are unsatisfied with a session, you can rate it and provide feedback via the link sent after the session within 2 working days. General feedback can be sent to our support email.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
