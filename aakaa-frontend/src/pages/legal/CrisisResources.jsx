import React from 'react';
import { AlertCircle, Phone, LifeBuoy } from 'lucide-react';

export default function CrisisResources() {
  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Warning Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-12">
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

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-aakaa-green text-white rounded-2xl flex items-center justify-center">
            <LifeBuoy size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Crisis Helplines & Resources</h1>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600 mb-8 font-medium">
            If you are going through a difficult time and need immediate support, the following organizations 
            offer free, confidential help available 24/7.
          </p>

          {/* India Helpline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">AASRA (India)</h3>
              <p className="text-gray-500 text-sm mt-1">24x7 Helpline for crisis intervention and suicide prevention.</p>
            </div>
            <a href="tel:+919820466726" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors whitespace-nowrap">
              <Phone size={18} />
              +91 9820466726
            </a>
          </div>

          {/* Vandrevala Foundation */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Vandrevala Foundation (India)</h3>
              <p className="text-gray-500 text-sm mt-1">Mental health helpline offering counseling.</p>
            </div>
            <a href="tel:9999666555" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors whitespace-nowrap">
              <Phone size={18} />
              9999 666 555
            </a>
          </div>

          {/* Global / US Helpline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">National Suicide Prevention Lifeline (US)</h3>
              <p className="text-gray-500 text-sm mt-1">Free, confidential support for people in distress.</p>
            </div>
            <a href="tel:988" className="flex items-center gap-2 px-6 py-3 bg-aakaa-green text-white rounded-xl font-bold hover:bg-aakaa-green/90 transition-colors whitespace-nowrap">
              <Phone size={18} />
              Dial 988
            </a>
          </div>

          {/* International Resources Link */}
          <div className="mt-8 p-6 bg-gray-100 rounded-2xl text-center">
            <h4 className="font-bold text-gray-900 mb-2">Outside India or the US?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Find a crisis line in your country via the International Association for Suicide Prevention (IASP).
            </p>
            <a 
              href="https://www.iasp.info/resources/Crisis_Centres/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-aakaa-green font-bold hover:underline"
            >
              View International Crisis Centers
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
