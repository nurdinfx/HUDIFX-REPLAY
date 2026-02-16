import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDB } from './utils/seedLogic.js';

dotenv.config();

const runSeeder = async () => {
    try {
        console.log('Connecting to MongoDB for seeding...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hudifx');
        console.log('Connected. Starting seed process...');

        await seedDB();

        console.log('Seeding complete. Disconnecting...');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

runSeeder();
