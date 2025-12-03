import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { PortfolioPost } from '../models/PortfolioPost';
import { User } from '../models/User';

const router = Router();

// Get all portfolio posts with filtering
router.get('/browse', async (req: Request, res: Response): Promise<void> => {
  try {
    const { maturity, category, userId, archived } = req.query;
    const query: Record<string, unknown> = { isHidden: false };

    if (maturity) query.maturity = maturity;
    if (category) query.category = category;
    if (userId) query.userId = userId;
    if (archived === 'true') query.isArchived = true;
    else if (archived === 'false') query.isArchived = false;

    const posts = await PortfolioPost.find(query)
      .populate('userId', 'firstName lastName location avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// Get user's portfolio posts
router.get('/my-posts', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await PortfolioPost.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// Get single portfolio post
router.get('/:postId', async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await PortfolioPost.findById(req.params.postId).populate('userId', 'firstName lastName location avatar');
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

// Create portfolio post
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, images, tags, maturity, category } = req.body;

    if (!title || !images || images.length === 0) {
      res.status(400).json({ message: 'Title and at least one image are required' });
      return;
    }

    const post = new PortfolioPost({
      userId: req.userId,
      title,
      description,
      images,
      tags: tags || [],
      maturity: maturity || 'sfw',
      category: category || 'other',
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Update portfolio post
router.put('/:postId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }

    const { title, description, images, tags, maturity, category } = req.body;
    if (title) post.title = title;
    if (description) post.description = description;
    if (images) post.images = images;
    if (tags) post.tags = tags;
    if (maturity) post.maturity = maturity;
    if (category) post.category = category;

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

// Archive portfolio post
router.patch('/:postId/archive', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    post.isArchived = !post.isArchived;
    await post.save();

    res.json({ message: `Post ${post.isArchived ? 'archived' : 'unarchived'}`, post });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving post', error });
  }
});

// Hide/Show portfolio post
router.patch('/:postId/hide', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    post.isHidden = !post.isHidden;
    await post.save();

    res.json({ message: `Post ${post.isHidden ? 'hidden' : 'shown'}`, post });
  } catch (error) {
    res.status(500).json({ message: 'Error hiding post', error });
  }
});

// Delete portfolio post
router.delete('/:postId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await PortfolioPost.findById(req.params.postId);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await PortfolioPost.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});

export default router;
