import React from 'react';
import { AlertCircle, Phone, LifeBuoy } from 'lucide-react';

export default function CrisisResources() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      {/* Banner Area */}
      <div className="w-full max-w-[95%] md:max-w-7xl mx-auto bg-aakaa-green text-white py-16 px-6 mb-16 rounded-[2.5rem] shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <LifeBuoy size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Crisis Helplines & Resources</h1>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Warning Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-12 shadow-sm">
          <div className="flex gap-4">
            <AlertCircle className="text-red-600 flex-shrink-0" size={28} />
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-2">Emergency Disclaimer</h2>
              <p className="text-red-800 font-medium leading-relaxed">
                Aakaa Health is <strong>not</strong> designed to handle mental health emergencies, crisis situations, 
                or instances where you or someone else is at risk of harm. If you are experiencing a life-threatening 
                emergency, please call your local emergency services immediately or go to the nearest hospital emergency room.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
            If you are going through a difficult time and need immediate support, the following organizations 
            offer free, confidential help available 24/7.
          </p>

          {/* India Helpline */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">AASRA (India)</h3>
              <p className="text-gray-500 mt-1">24x7 Helpline for crisis intervention and suicide prevention.</p>
            </div>
            <a href="tel:+919820466726" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors shadow-sm whitespace-nowrap">
              <Phone size={18} />
              +91 9820466726
            </a>
          </div>

          {/* Vandrevala Foundation */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Vandrevala Foundation (India)</h3>
              <p className="text-gray-500 mt-1">Mental health helpline offering counseling.</p>
            </div>
            <a href="tel:9999666555" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors shadow-sm whitespace-nowrap">
              <Phone size={18} />
              9999 666 555
            </a>
          </div>

          {/* Global / US Helpline */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">National Suicide Prevention Lifeline (US)</h3>
              <p className="text-gray-500 mt-1">Free, confidential support for people in distress.</p>
            </div>
            <a href="tel:988" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors shadow-sm whitespace-nowrap">
              <Phone size={18} />
              Dial 988
            </a>
          </div>

          {/* International Resources Link */}
          <div className="mt-8 p-8 bg-aakaa-green/5 rounded-[2rem] text-center border border-aakaa-green/10">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Outside India or the US?</h4>
            <p className="text-gray-600 mb-6">
              Find a crisis line in your country via the International Association for Suicide Prevention (IASP).
            </p>
            <a 
              href="https://www.iasp.info/resources/Crisis_Centres/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-white text-aakaa-green font-bold rounded-xl border border-aakaa-green/20 hover:bg-gray-50 transition-colors shadow-sm"
            >
              View International Crisis Centers
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
