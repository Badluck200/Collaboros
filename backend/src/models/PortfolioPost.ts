import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  maturity: 'sfw' | 'mature'; // Safe for Work or +18
  isArchived: boolean;
  isHidden: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const portfolioPostSchema = new Schema<IPortfolioPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one image is required',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    maturity: {
      type: String,
      enum: ['sfw', 'mature'],
      default: 'sfw',
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['graphic-design', 'photography', 'brand-identity', 'illustration', 'web-design', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

// Index for efficient querying
portfolioPostSchema.index({ userId: 1, isArchived: 1, isHidden: 1 });
portfolioPostSchema.index({ maturity: 1 });

export const PortfolioPost = mongoose.model<IPortfolioPost>('PortfolioPost', portfolioPostSchema);
