'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState } from 'react';

export default function Portfolio() {
  const [filterMaturity, setFilterMaturity] = useState('all'); // all, sfw, mature

  const mockPortfolios = [
    {
      id: 1,
      name: 'Sarah Creative',
      type: 'Graphic Designer',
      location: 'New York, NY',
      image: '🎨',
      rating: 4.9,
      reviews: 24,
      maturity: 'sfw',
    },
    {
      id: 2,
      name: 'Alex Photography',
      type: 'Photographer',
      location: 'Los Angeles, CA',
      image: '📸',
      rating: 4.8,
      reviews: 18,
      maturity: 'sfw',
    },
    {
      id: 3,
      name: 'Jordan Designs',
      type: 'Brand Designer',
      location: 'Seattle, WA',
      image: '🖌️',
      rating: 4.7,
      reviews: 12,
      maturity: 'mature',
    },
    {
      id: 4,
      name: 'Casey Studios',
      type: 'Photographer',
      location: 'Miami, FL',
      image: '📷',
      rating: 5.0,
      reviews: 31,
      maturity: 'sfw',
    },
  ];

  const filteredPortfolios = mockPortfolios.filter((p) => {
    if (filterMaturity === 'all') return true;
    return p.maturity === filterMaturity;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Creatives</h1>
          <p className="text-xl text-gray-600">Find talented designers and photographers for your project.</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-lg mb-4 text-gray-900">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>All Types</option>
                <option>Graphic Designer</option>
                <option>Photographer</option>
                <option>Brand Designer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>All Locations</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>All Ratings</option>
                <option>4.5+</option>
                <option>4.0+</option>
                <option>3.5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Filter</label>
              <select
                value={filterMaturity}
                onChange={(e) => setFilterMaturity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              >
                <option value="all">All Content</option>
                <option value="sfw">Safe for Work Only</option>
                <option value="mature">+18 Content</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolios.map((portfolio) => (
            <div key={portfolio.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 h-40 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('/images/portfolio-${portfolio.id}.jpg')`}}>
                  <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{portfolio.name}</h3>
                <p className="text-amber-700 font-semibold mb-2">{portfolio.type}</p>
                <p className="text-gray-600 text-sm mb-4">{portfolio.location}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 font-semibold text-gray-900">{portfolio.rating}</span>
                  <span className="ml-1 text-gray-600">({portfolio.reviews} reviews)</span>
                </div>

                {/* Maturity Badge */}
                <div className="mb-4">
                  {portfolio.maturity === 'mature' && (
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full">
                      +18 Mature Content
                    </span>
                  )}
                  {portfolio.maturity === 'sfw' && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Safe for Work
                    </span>
                  )}
                </div>

                <button className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition font-semibold">
                  View Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPortfolios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No creatives found with your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
