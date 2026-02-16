import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    passwordHash: string;
    subscriptionPlan: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    subscriptionPlan: { type: String, default: 'free', enum: ['free', 'pro', 'premium'] },
    avatar: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
