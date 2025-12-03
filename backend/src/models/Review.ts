import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  jobId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId; // Client reviewing Creative
  creativeId: mongoose.Types.ObjectId; // Creative being reviewed
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'JobRequest',
      required: true,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creativeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
reviewSchema.index({ creativeId: 1 });
reviewSchema.index({ jobId: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
