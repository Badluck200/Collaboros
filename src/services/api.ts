const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.endsWith('/api')
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
  message: string;
  token: string;
  userId: string;
}

export interface PortfolioPost {
  _id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  maturity: 'sfw' | 'mature';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobRequest {
  _id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  status: string;
  createdAt: string;
}

// Auth endpoints
export async function registerUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'creative' | 'client';
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

// Portfolio endpoints
export async function getPortfolioPosts(filters?: {
  maturity?: string;
  category?: string;
  userId?: string;
}): Promise<PortfolioPost[]> {
  const params = new URLSearchParams();
  if (filters?.maturity) params.append('maturity', filters.maturity);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.userId) params.append('userId', filters.userId);

  const response = await fetch(`${API_URL}/portfolio/browse?${params.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch portfolio posts');

  return response.json();
}

export async function getPortfolioPost(postId: string): Promise<PortfolioPost> {
  const response = await fetch(`${API_URL}/portfolio/${postId}`);

  if (!response.ok) throw new Error('Failed to fetch portfolio post');

  return response.json();
}

export async function createPortfolioPost(
  token: string,
  postData: {
    title: string;
    description: string;
    images: string[];
    tags: string[];
    maturity: 'sfw' | 'mature';
    category: string;
  }
): Promise<PortfolioPost> {
  const response = await fetch(`${API_URL}/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portfolio post');
  }

  return response.json();
}

// Jobs endpoints
export async function getJobs(filters?: {
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  category?: string;
}): Promise<JobRequest[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.minBudget) params.append('minBudget', filters.minBudget.toString());
  if (filters?.maxBudget) params.append('maxBudget', filters.maxBudget.toString());
  if (filters?.category) params.append('category', filters.category);

  const response = await fetch(`${API_URL}/jobs?${params.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch jobs');

  return response.json();
}

export async function getJob(jobId: string): Promise<JobRequest> {
  const response = await fetch(`${API_URL}/jobs/${jobId}`);

  if (!response.ok) throw new Error('Failed to fetch job');

  return response.json();
}

export async function createJob(
  token: string,
  jobData: {
    title: string;
    description: string;
    category: string;
    budget: { min: number; max: number; currency: string };
    deadline: string;
  }
): Promise<JobRequest> {
  const response = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create job');
  }

  return response.json();
}

// User endpoints
export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_URL}/users/${userId}`);

  if (!response.ok) throw new Error('Failed to fetch user profile');

  return response.json();
}

export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch current user');

  return response.json();
}

export async function updateUserProfile(
  token: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    avatar?: string;
  }
) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
}

export async function searchCreatives(query?: string, location?: string) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (location) params.append('location', location);

  const response = await fetch(`${API_URL}/users/search/creatives?${params.toString()}`);

  if (!response.ok) throw new Error('Failed to search creatives');

  return response.json();
}

export async function searchUserByUsername(username: string) {
  const response = await fetch(`${API_URL}/users/search/username/${username}`);

  if (!response.ok) throw new Error('User not found');

  return response.json();
}

// Messages endpoints
export async function getConversations(token: string) {
  const response = await fetch(`${API_URL}/messages/conversations/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch conversations');

  return response.json();
}

export async function getConversation(token: string, userId: string) {
  const response = await fetch(`${API_URL}/messages/conversation/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch conversation');

  return response.json();
}

export async function sendMessage(
  token: string,
  messageData: {
    recipientId: string;
    content: string;
    jobId?: string;
  }
) {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send message');
  }

  return response.json();
}

// Reviews endpoints
export async function getCreativeReviews(creativeId: string) {
  const response = await fetch(`${API_URL}/reviews/creative/${creativeId}`);

  if (!response.ok) throw new Error('Failed to fetch reviews');

  return response.json();
}

export async function createReview(
  token: string,
  reviewData: {
    jobId: string;
    creativeId: string;
    rating: number;
    comment?: string;
  }
) {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create review');
  }

  return response.json();
}

// Health check
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
