import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Helper function to generate unique username
async function generateUniqueUsername(firstName: string, lastName: string): Promise<string> {
  const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
  
  let username: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    username = `${baseUsername}#${randomNum}`;
    
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
      return username;
    }
    attempts++;
  }

  // Fallback with timestamp if all attempts fail
  const timestamp = Date.now().toString().slice(-4);
  return `${baseUsername}#${timestamp}`;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !userType) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    // Generate unique username
    const username = await generateUniqueUsername(firstName, lastName);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      userType,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production', {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production', {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
