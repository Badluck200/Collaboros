'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState } from 'react';

export default function Jobs() {
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

  const mockJobs = [
    {
      id: 1,
      title: 'Logo Design for Startup',
      client: 'TechStart Inc',
      budget: '$500 - $1000',
      deadline: '2 weeks',
      description: 'Need a modern, minimalist logo for a fintech startup.',
      status: 'open',
    },
    {
      id: 2,
      title: 'Product Photography',
      client: 'Fashion Brand',
      budget: '$800 - $1200',
      deadline: '10 days',
      description: 'Professional product shots for e-commerce site.',
      status: 'open',
    },
    {
      id: 3,
      title: 'Brand Identity Package',
      client: 'Creative Agency',
      budget: '$2000+',
      deadline: '1 month',
      description: 'Complete branding package: logo, color palette, typography.',
      status: 'open',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Requests</h1>
          <p className="text-xl text-gray-600">Find projects and collaborate with clients.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'browse' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'create' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Post a Job (Clients)
          </button>
        </div>

        {/* Browse Jobs Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {mockJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-gray-600">{job.client}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="text-lg font-bold text-gray-900">{job.budget}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="text-lg font-bold text-gray-900">{job.deadline}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-lg font-bold text-gray-900">Design</p>
                  </div>
                </div>

                <button className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold">
                  Submit Proposal
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Post a Job Tab */}
        {activeTab === 'create' && (
          <div className="bg-gray-50 rounded-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g., Logo Design for Startup"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe your project in detail..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="text"
                    placeholder="e.g., $500 - $1000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g., 2 weeks"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>Select a category</option>
                  <option>Logo Design</option>
                  <option>Brand Identity</option>
                  <option>Product Photography</option>
                  <option>Event Photography</option>
                  <option>Graphic Design</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition font-semibold text-lg"
              >
                Post Job
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
