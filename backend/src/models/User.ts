import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  userType: 'creative' | 'client';
  bio?: string;
  location?: string;
  avatar?: string;
  settings: {
    maturityFilter: boolean; // true = hide +18 content
    allowMessaging: boolean;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9_]+#\d{4}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    userType: {
      type: String,
      enum: ['creative', 'client'],
      required: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
    },
    avatar: {
      type: String,
    },
    settings: {
      maturityFilter: {
        type: Boolean,
        default: true, // Hide +18 content by default
      },
      allowMessaging: {
        type: Boolean,
        default: true,
      },
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Index for username search
userSchema.index({ username: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
