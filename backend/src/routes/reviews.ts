import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Review } from '../models/Review';

const router = Router();

// Get reviews for a creative
router.get('/creative/:creativeId', async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ creativeId: req.params.creativeId })
      .populate('reviewerId', 'firstName lastName avatar')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.json({
      reviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// Get reviews for a job
router.get('/job/:jobId', async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ jobId: req.params.jobId })
      .populate('reviewerId', 'firstName lastName avatar')
      .populate('creativeId', 'firstName lastName avatar');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// Create review (client reviews creative)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId, creativeId, rating, comment } = req.body;

    if (!jobId || !creativeId || !rating) {
      res.status(400).json({ message: 'Job ID, creative ID, and rating are required' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ jobId, creativeId });
    if (existingReview) {
      res.status(409).json({ message: 'Review already exists for this job' });
      return;
    }

    const review = new Review({
      jobId,
      reviewerId: req.userId,
      creativeId,
      rating,
      comment: comment || '',
    });

    await review.save();
    await review.populate('reviewerId', 'firstName lastName avatar');
    await review.populate('creativeId', 'firstName lastName avatar');

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
});

// Update review
router.put('/:reviewId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    if (review.reviewerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const { rating, comment } = req.body;
    if (rating) {
      if (rating < 1 || rating > 5) {
        res.status(400).json({ message: 'Rating must be between 1 and 5' });
        return;
      }
      review.rating = rating;
    }
    if (comment) review.comment = comment;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
});

// Delete review
router.delete('/:reviewId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    if (review.reviewerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
});

export default router;
