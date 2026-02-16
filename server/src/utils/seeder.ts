import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { seedDB } from './seedLogic.js';

dotenv.config();

// Run seeding
connectDB().then(() => seedDB().then(() => {
    console.log('Seeding process completed.');
    process.exit(0);
})).catch(err => {
    console.error('Final Seeding Error:', err);
    process.exit(1);
});
