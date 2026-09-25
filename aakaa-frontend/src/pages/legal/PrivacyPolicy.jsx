import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner Area */}
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto bg-aakaa-green text-white py-16 px-6 mb-16 rounded-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Privacy Policy</h1>

        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="prose prose-lg prose-green max-w-none text-gray-700">
          <p className="text-xl font-medium text-gray-900 mb-10 leading-relaxed">
            Your privacy is important to us. This Privacy Policy explains how Aakaa Health collects, 
            uses, and discloses your personal data when you use our website, application, and services. 
            By using our Services, you agree to the collection and use of information in accordance with this policy.
          </p>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Medical Information Disclaimer</h3>
              <p className="leading-relaxed">
                The services provided by Aakaa Health are intended to support emotional well-being and are not a replacement for face-to-face psychotherapy, professional medical care, diagnosis, or treatment. Our services are not designed for use in crises, emergencies, or severe mental health conditions. If you are experiencing a medical emergency or crisis, please contact your local emergency services immediately.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Information We Collect</h3>
              <p className="leading-relaxed mb-4">
                To provide our emotional well-being services, we may collect personal and sensitive information, which may include:
              </p>
              <ul className="space-y-3">
                <li>Personal identifiers (name, contact information).</li>
                <li>Health conditions, medical history, and related mental health information required to provide adequate care.</li>
                <li>Information to detect SOS or self-harm triggers to signpost safety resources.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">How We Use Your Information</h3>
              <p className="leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-3">
                <li>Provide, maintain, and improve our services and your overall customer experience.</li>
                <li>Ensure continuity in conversation and treatment between you and our professionals.</li>
                <li>Perform analytics and research to improve product and service quality.</li>
                <li>Keep records of communication to help solve any issues you might face.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Information Sharing and Disclosure</h3>
              <p className="leading-relaxed mb-4">
                We take your confidentiality seriously. We use trusted third-party service providers bound by strict confidentiality and non-disclosure obligations to store and process data. We do not share your personal data with outside companies or organizations without your consent, except in the following legitimate interests:
              </p>
              <ul className="space-y-3">
                <li>To comply with applicable laws, court orders, or administrative proceedings.</li>
                <li>For disclosures necessary to prevent a serious threat to health or safety.</li>
                <li>To protect the rights, property, and safety of our users and our platform.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Data Retention</h3>
              <p className="leading-relaxed">
                We may retain a copy of your data even after you terminate your use of our services if it is reasonably necessary. This includes retaining data to comply with legal requirements, respond to your requests, or fulfill processing in our legitimate interest. Data is typically retained for up to 10 years in accordance with internal policies.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">No Warranties and Limited Liability</h3>
              <p className="leading-relaxed">
                The information and services on Aakaa Health are provided on an "as is" basis. We do not guarantee the completeness, accuracy, or reliability of any information. We are not liable for any decisions made based on the provided information, nor are we liable for damages resulting from loss of data, technical interruptions, or unauthorized access.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Indemnity</h3>
              <p className="leading-relaxed">
                By using our services, you agree to indemnify and hold harmless Aakaa Health, its affiliates, directors, and employees against any claims, demands, damages, losses, or expenses arising out of a claim by a third party relating to your use of the services or any violation of this agreement.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Changes to this Policy</h3>
              <p className="leading-relaxed">
                We may amend this privacy policy from time to time to keep it up to date with legal requirements and service changes. We encourage you to regularly check this page for the latest version.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
