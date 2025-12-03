import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { JobRequest } from '../models/JobRequest';
import { User } from '../models/User';

const router = Router();

// Get all open jobs
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, category, minBudget, maxBudget } = req.query;
    const query: any = {};

    if (status) query.status = status;
    else query.status = 'open'; // Default to open jobs

    if (category) query.category = category;

    if (minBudget || maxBudget) {
      query['budget.min'] = { $gte: minBudget ? parseInt(minBudget as string) : 0 };
      if (maxBudget) {
        query['budget.max'] = { $lte: parseInt(maxBudget as string) };
      }
    }

    const jobs = await JobRequest.find(query)
      .populate('clientId', 'firstName lastName email')
      .populate('selectedCreative', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

// Get user's jobs (client)
router.get('/my-jobs', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await JobRequest.find({ clientId: req.userId })
      .populate('proposals')
      .populate('selectedCreative', 'firstName lastName email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

// Get single job
router.get('/:jobId', async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.jobId)
      .populate('clientId', 'firstName lastName email')
      .populate('proposals')
      .populate('selectedCreative', 'firstName lastName email');

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error });
  }
});

// Create job request (client)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, budget, deadline } = req.body;

    if (!title || !description || !category || !budget || !deadline) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const job = new JobRequest({
      clientId: req.userId,
      title,
      description,
      category,
      budget,
      deadline: new Date(deadline),
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
});

// Update job
router.put('/:jobId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.clientId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const { title, description, category, budget, deadline, status } = req.body;
    if (title) job.title = title;
    if (description) job.description = description;
    if (category) job.category = category;
    if (budget) job.budget = budget;
    if (deadline) job.deadline = new Date(deadline);
    if (status) job.status = status;

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
});

// Close job
router.patch('/:jobId/close', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.clientId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    job.status = 'closed';
    await job.save();

    res.json({ message: 'Job closed', job });
  } catch (error) {
    res.status(500).json({ message: 'Error closing job', error });
  }
});

// Delete job
router.delete('/:jobId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await JobRequest.findById(req.params.jobId);

    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    if (job.clientId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await JobRequest.findByIdAndDelete(req.params.jobId);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

export default router;
