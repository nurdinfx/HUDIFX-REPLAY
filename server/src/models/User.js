import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    subscriptionPlan: { type: String, default: 'free', enum: ['free', 'pro', 'premium'] },
    avatar: { type: String },
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map