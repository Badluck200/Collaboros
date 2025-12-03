import { Router } from 'express';
import { Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';

const router = Router();

// Get conversation with a user
router.get('/conversation/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, recipientId: userId },
        { senderId: userId, recipientId: req.userId },
      ],
    })
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error });
  }
});

// Get all conversations (unique users)
router.get('/conversations/list', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.userId }, { recipientId: req.userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar');

    // Get unique conversations
    const conversations = new Map();
    messages.forEach((msg) => {
      const otherId = msg.senderId._id.toString() === req.userId ? msg.recipientId._id.toString() : msg.senderId._id.toString();
      if (!conversations.has(otherId)) {
        conversations.set(otherId, msg);
      }
    });

    res.json(Array.from(conversations.values()));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error });
  }
});

// Send message
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipientId, content, jobId } = req.body;

    if (!recipientId || !content) {
      res.status(400).json({ message: 'Recipient ID and content are required' });
      return;
    }

    const message = new Message({
      senderId: req.userId,
      recipientId,
      content,
      jobId: jobId || undefined,
    });

    await message.save();
    await message.populate('senderId', 'firstName lastName avatar');
    await message.populate('recipientId', 'firstName lastName avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
});

// Mark message as read
router.patch('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.recipientId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    message.isRead = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error });
  }
});

// Delete message
router.delete('/:messageId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (message.senderId.toString() !== req.userId && message.recipientId.toString() !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error });
  }
});

export default router;
