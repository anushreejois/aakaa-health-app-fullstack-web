import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-aakaa-green text-white rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Terms of Service</h1>
            <p className="text-gray-500 font-medium mt-1">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 prose prose-green max-w-none">
          <p>
            Welcome to Aakaa Health. These Terms of Service govern your access to and use of our website, 
            application, and services (collectively, the "Services"). By accessing or using the Services, 
            you agree to be bound by these Terms.
          </p>

          <h3>1. Nature of the Services</h3>
          <p>
            Aakaa Health is a platform that connects users with licensed mental health professionals and yoga 
            instructors. <strong>We do not provide emergency medical services.</strong> If you are experiencing a medical emergency 
            or a mental health crisis, please call your local emergency services immediately.
          </p>

          <h3>2. User Responsibilities</h3>
          <p>By using Aakaa Health, you agree that:</p>
          <ul>
            <li>You are at least 18 years of age (or have the consent of a parent/guardian if permitted by law).</li>
            <li>You will provide accurate, current, and complete information during registration and booking.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You will not use the Services for any illegal or unauthorized purpose.</li>
          </ul>

          <h3>3. Professional Advice Disclaimer</h3>
          <p>
            While Aakaa Health connects you with licensed professionals, the content on our website (such as blogs, 
            articles, and generic advice) is for informational purposes only and does not constitute medical advice, 
            diagnosis, or treatment.
          </p>

          <h3>4. Payments and Subscriptions</h3>
          <p>
            By booking a session or purchasing a service, you agree to pay all applicable fees. Payments are processed 
            securely via our third-party payment processors. For information regarding refunds, please review our 
            Refund & Cancellation Policy.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Aakaa Health and its affiliates, directors, or employees shall not 
            be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
            or revenues resulting from your use of the Services.
          </p>
        </div>
      </div>
    </div>
  );
}
