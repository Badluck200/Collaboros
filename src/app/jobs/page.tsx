'use client';

import Navbar from '@/components/Navigation/Navbar';
import { useState, useEffect, useRef } from 'react';
import { getJobs, createJob } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

interface Job {
  _id: string;
  clientId: {
    firstName: string;
    lastName: string;
    displayName?: string;
  };
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  createdAt: string;
}

export default function Jobs() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form refs
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const minBudgetRef = useRef<HTMLInputElement>(null);
  const maxBudgetRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadJobs();
  }, [statusFilter, categoryFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const filters: Record<string, unknown> = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;

      const data = await getJobs(filters as { status?: string; category?: string });
      // API returns populated clientId as object
      setJobs(data as unknown as Job[]);
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      setError('You must be logged in to post a job');
      return;
    }

    if (user.userType !== 'client') {
      setError('Only clients can post jobs');
      return;
    }

    try {
      const jobData = {
        title: titleRef.current!.value,
        description: descriptionRef.current!.value,
        category: categoryRef.current!.value,
        budget: {
          min: parseInt(minBudgetRef.current!.value, 10),
          max: parseInt(maxBudgetRef.current!.value, 10),
          currency: 'USD',
        },
        deadline: deadlineRef.current!.value,
      };

      await createJob(token, jobData);
      setSuccessMessage('Job posted successfully!');
      setError('');
      
      // Clear form
      if (titleRef.current) titleRef.current.value = '';
      if (descriptionRef.current) descriptionRef.current.value = '';
      if (categoryRef.current) categoryRef.current.value = '';
      if (minBudgetRef.current) minBudgetRef.current.value = '';
      if (maxBudgetRef.current) maxBudgetRef.current.value = '';
      if (deadlineRef.current) deadlineRef.current.value = '';

      // Reload jobs
      loadJobs();
      
      // Switch to browse tab
      setTimeout(() => {
        setActiveTab('browse');
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      console.error(err);
    }
  };

  const formatBudget = (budget: Job['budget']) => {
    return `$${budget.min} - $${budget.max} ${budget.currency}`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div>
            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="all">All Categories</option>
                  <option value="logo-design">Logo Design</option>
                  <option value="brand-identity">Brand Identity</option>
                  <option value="product-photography">Product Photography</option>
                  <option value="event-photography">Event Photography</option>
                  <option value="web-design">Web Design</option>
                  <option value="illustration">Illustration</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No jobs found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600">
                          {job.clientId.displayName || `${job.clientId.firstName} ${job.clientId.lastName}`}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{job.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{formatBudget(job.budget)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="text-lg font-bold text-gray-900">{formatDeadline(job.deadline)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-lg font-bold text-gray-900">{formatCategory(job.category)}</p>
                      </div>
                    </div>

                    <button className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition font-semibold">
                      Submit Proposal
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post a Job Tab */}
        {activeTab === 'create' && (
          <div className="bg-gray-50 rounded-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h2>
            
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  ref={titleRef}
                  type="text"
                  placeholder="e.g., Logo Design for Startup"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  ref={descriptionRef}
                  placeholder="Describe your project in detail..."
                  rows={6}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  ref={categoryRef}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                >
                  <option value="">Select a category</option>
                  <option value="logo-design">Logo Design</option>
                  <option value="brand-identity">Brand Identity</option>
                  <option value="product-photography">Product Photography</option>
                  <option value="event-photography">Event Photography</option>
                  <option value="web-design">Web Design</option>
                  <option value="illustration">Illustration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Budget ($) *</label>
                  <input
                    ref={minBudgetRef}
                    type="number"
                    placeholder="e.g., 500"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Budget ($) *</label>
                  <input
                    ref={maxBudgetRef}
                    type="number"
                    placeholder="e.g., 1000"
                    min="0"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
                <input
                  ref={deadlineRef}
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
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
