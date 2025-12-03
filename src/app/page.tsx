'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navigation/Navbar';
import Link from 'next/link';
import { getPortfolioPosts, checkApiHealth } from '@/services/api';

interface PortfolioPost {
  _id: string;
  title: string;
  description: string;
  images: string[];
  maturity: 'sfw' | 'mature';
  category: string;
  tags?: string[];
}

export default function Home() {
  const [portfolioPosts, setPortfolioPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const isConnected = await checkApiHealth();
        setApiConnected(isConnected);

        if (isConnected) {
          const posts = await getPortfolioPosts({ maturity: 'sfw' });
          setPortfolioPosts(posts.slice(0, 6));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      <Navbar />

      {apiConnected && (
        <div className="bg-green-100 border-l-4 border-green-700 text-green-700 p-4">
          <div className="max-w-7xl mx-auto">
            <p className="font-semibold">✓ Connected to Collaboros API</p>
          </div>
        </div>
      )}
      {!apiConnected && !loading && (
        <div className="bg-amber-100 border-l-4 border-amber-700 text-amber-700 p-4">
          <div className="max-w-7xl mx-auto">
            <p className="font-semibold">⚠ Backend API not responding. Some features may be limited.</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Showcase Your <span className="text-amber-700">Creative Work</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Collaboros is the platform for designers and photographers to showcase portfolios, collaborate with clients, and get hired. Simple, elegant, and designed for creatives.
            </p>
            <div className="flex gap-4">
              <button className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-semibold">
                Get Started as a Creative
              </button>
              <Link href="/portfolio">
                <button className="border-2 border-amber-700 text-amber-700 px-8 py-3 rounded-lg hover:bg-amber-50 transition font-semibold">
                  Browse Creatives
                </button>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-lg h-96 flex items-center justify-center overflow-hidden shadow-lg">
            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/images/portfolio-hero.jpg')"}}>
              <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Portfolio Showcase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/70 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Collaboros?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-amber-700">
              <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center text-2xl">📁</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Build Your Portfolio</h3>
              <p className="text-gray-600">Showcase your best work with a clean, modern portfolio. Upload images, add descriptions, and tag your projects.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-white to-orange-50 p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-amber-700">
              <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center text-2xl">💼</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Get Hired</h3>
              <p className="text-gray-600">Receive job requests from clients, manage projects, and deliver files in a professional, organized way.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-white to-rose-50 p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-amber-700">
              <div className="w-12 h-12 bg-amber-100 rounded-lg mb-4 flex items-center justify-center text-2xl">💬</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">Easy Collaboration</h3>
              <p className="text-gray-600">Message with clients, share updates, and collaborate seamlessly in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolios Section */}
      {apiConnected && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Creatives</h2>
          <p className="text-xl text-gray-600 mb-12">Discover talented designers and photographers on Collaboros</p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : portfolioPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolioPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105"
                >
                  <div
                    className="w-full h-48 bg-cover bg-center"
                    style={{backgroundImage: `url('${post.images[0] || '/images/portfolio-1.jpg'}')`}}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{post.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {post.tags && post.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition font-semibold">
                      View Portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No portfolios yet. Be the first to create one!</p>
            </div>
          )}
        </section>
      )}

      {/* For Clients CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-lg h-96 flex items-center justify-center overflow-hidden shadow-lg">
            <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('/images/client-browse.jpg')"}}>
              <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Looking for Design or Photography?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse portfolios from talented designers and photographers. Filter by style, location, and price to find the perfect creative for your project.
            </p>
            <Link href="/portfolio">
              <button className="bg-amber-700 text-white px-8 py-3 rounded-lg hover:bg-amber-800 transition font-semibold">
                Browse Creatives
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-amber-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-lg font-bold">Collaboros</span>
              </div>
              <p className="text-amber-200">The platform for creative collaboration.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Creatives</h4>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#" className="hover:text-amber-50 transition">Dashboard</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">Portfolio</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Clients</h4>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#" className="hover:text-amber-50 transition">Browse</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">How it Works</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#" className="hover:text-amber-50 transition">About</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">Blog</a></li>
                <li><a href="#" className="hover:text-amber-50 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800 pt-8 text-center text-amber-200">
            <p>&copy; 2025 Collaboros. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
