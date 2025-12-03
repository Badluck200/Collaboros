import mongoose, { Document, Schema } from 'mongoose';

export interface IJobRequest extends Document {
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: Date;
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  proposals: mongoose.Types.ObjectId[];
  selectedCreative?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jobRequestSchema = new Schema<IJobRequest>(
  {
    clientId: {
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
      required: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      enum: ['logo-design', 'product-photography', 'brand-identity', 'web-design', 'event-photography', 'illustration', 'other'],
      required: true,
    },
    budget: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'closed'],
      default: 'open',
    },
    proposals: {
      type: [Schema.Types.ObjectId],
      ref: 'Proposal',
      default: [],
    },
    selectedCreative: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index for efficient querying
jobRequestSchema.index({ clientId: 1, status: 1 });
jobRequestSchema.index({ status: 1, deadline: 1 });

export const JobRequest = mongoose.model<IJobRequest>('JobRequest', jobRequestSchema);
