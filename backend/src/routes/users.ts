import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Get user profile
router.get('/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Get current user profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, bio, location, avatar } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (avatar) user.avatar = avatar;

    await user.save();
    const updatedUser = await User.findById(req.userId).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Update user settings (maturity filter, privacy, etc.)
router.put('/settings/preferences', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { maturityFilter, allowMessaging, isPublic } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (maturityFilter !== undefined) user.settings.maturityFilter = maturityFilter;
    if (allowMessaging !== undefined) user.settings.allowMessaging = allowMessaging;
    if (isPublic !== undefined) user.settings.isPublic = isPublic;

    await user.save();

    res.json({
      message: 'Settings updated',
      settings: user.settings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error });
  }
});

// Search creatives with filters
router.get('/search/creatives', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, location, userType } = req.query;
    const searchQuery: Record<string, unknown> = { userType: 'creative', 'settings.isPublic': true };

    if (query) {
      searchQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } },
      ];
    }

    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    const creatives = await User.find(searchQuery).select('-password').limit(50);

    res.json(creatives);
  } catch (error) {
    res.status(500).json({ message: 'Error searching creatives', error });
  }
});

// Search user by username
router.get('/search/username/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for user', error });
  }
});

// Delete account
router.delete('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error });
  }
});

export default router;
