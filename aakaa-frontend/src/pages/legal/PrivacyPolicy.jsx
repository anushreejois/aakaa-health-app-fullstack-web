import React from 'react';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-aakaa-green text-white rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500 font-medium mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 prose prose-green max-w-none">
          <p>
            At Aakaa Health, we take your privacy and the security of your personal and health information very seriously. 
            This Privacy Policy describes how we collect, use, process, and disclose your information, including personal 
            information, in conjunction with your access to and use of our platform.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us when you create an account, update your profile, use the 
            interactive features of our services, book a session, or communicate with us. This may include:
          </p>
          <ul>
            <li>Contact details (name, email, phone number)</li>
            <li>Demographic data and preferences</li>
            <li>Health-related information you choose to share during bookings or quizzes</li>
            <li>Payment information (processed securely through our third-party payment providers)</li>
          </ul>

          <h3>2. Health Data & Compliance</h3>
          <p>
            Because we facilitate mental health services, the data you provide may be considered sensitive health data. 
            We comply with applicable health data protection regulations, including the DPDP Act (India) and maintain 
            strict confidentiality regarding your therapy sessions. Your therapy notes and session details are strictly 
            between you and your therapist.
          </p>

          <h3>3. How We Use Your Information</h3>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Match you with appropriate therapists based on your intake quiz</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices, updates, security alerts, and administrative messages</li>
          </ul>

          <h3>4. Data Security</h3>
          <p>
            We use reasonable and appropriate technical and organizational measures to protect personal information 
            from loss, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet 
            transmission is completely secure, and we cannot guarantee absolute security.
          </p>

          <h3>5. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact our Data Protection Officer at 
            <strong> hello@aakaa.app</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
