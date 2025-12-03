'use client';

import Navbar from '@/components/Navigation/Navbar';
import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings'>('portfolio');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-8 mb-12">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-amber-700">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/images/profile-avatar.jpg')"}}></div>
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">John Designer</h1>
                <p className="text-xl opacity-90">Graphic Designer • Brand Specialist</p>
                <p className="text-sm opacity-75 mt-2">New York, NY • Member since 2024</p>
              </div>
            </div>
            <button className="bg-white text-amber-700 px-6 py-2 rounded-lg hover:bg-amber-50 transition font-semibold">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'portfolio' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Portfolio
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'settings' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">My Works</h2>
              <button className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold">
                + Add New Work
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Portfolio Item 1 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 h-40 flex items-center justify-center overflow-hidden rounded-lg">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/images/portfolio-work-1.jpg')"}}></div>
              </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Brand Identity Package</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete branding for a tech startup.</p>

                  {/* Content Rating */}
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Safe for Work
                    </span>
                  </div>

                  {/* Status */}
                  <div className="mb-4 flex gap-2">
                    <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Visible
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold">
                      Edit
                    </button>
                    <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold">
                      Archive
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio Item 2 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition opacity-75">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 h-40 flex items-center justify-center overflow-hidden rounded-lg opacity-75">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/images/portfolio-work-2.jpg')"}}></div>
              </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Web Design Mockup</h3>
                  <p className="text-gray-600 text-sm mb-4">E-commerce website redesign.</p>

                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Safe for Work
                    </span>
                  </div>

                  <div className="mb-4 flex gap-2">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Archived
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold">
                      Restore
                    </button>
                    <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h2>

            {/* Account Basics */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Account Basics</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value="john@example.com"
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value="John Designer"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value="Passionate graphic designer specializing in brand identity."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Advanced Settings - Content Filter */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Advanced Settings</h3>

              {/* Maturity Filter */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2">Content Filter</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Toggle this setting to show or hide +18 (mature) content in your browsing experience. When enabled, you will only see Safe for Work content. When disabled, you may see mature content from creatives.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="ml-3 text-gray-700 font-semibold">Hide +18 Content (Safe for Work)</span>
                  </label>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    💡 <strong>Tip:</strong> This setting applies to portfolio browsing and recommendations. You can temporarily override this filter on individual portfolios if needed.
                  </p>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-bold text-gray-900 mb-4">Privacy</h4>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked={true} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="ml-3 text-gray-700">Make my profile public</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                    <span className="ml-3 text-gray-700">Allow clients to contact me</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
