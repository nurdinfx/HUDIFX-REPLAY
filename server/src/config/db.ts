import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { seedDB } from '../utils/seedLogic.js';

let mongoMemoryServer: MongoMemoryServer | null = null;

const connectDB = async (retryCount = 0): Promise<typeof mongoose | void> => {
    const MONGO_URI = process.env.MONGO_URI || '';
    const LOCAL_URI = 'mongodb://localhost:27017/hudifx';
    const MAX_RETRIES = 1;

    try {
        const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Atlas Connection Error: ${(error as Error).message}`);

        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying Atlas connection in 2 seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return connectDB(retryCount + 1);
        }

        console.log('Atlas failed. Trying local MongoDB...');
        try {
            const connLocal = await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 2000 });
            console.log(`MongoDB Connected (Local): ${connLocal.connection.host}`);
            return connLocal;
        } catch (localError) {
            console.error(`Local Connection Error: ${(localError as Error).message}`);

            console.log('Local failed. Using ultimate fallback: In-Memory MongoDB...');
            try {
                if (!mongoMemoryServer) {
                    mongoMemoryServer = await MongoMemoryServer.create();
                }
                const uri = mongoMemoryServer.getUri();
                const connMemory = await mongoose.connect(uri);
                console.log(`MongoDB Connected (In-Memory): ${connMemory.connection.host}`);
                console.log('NOTE: Data will NOT be persistent across restarts.');

                // Auto-seed for development
                console.log('Auto-seeding in-memory database...');
                await seedDB();
                console.log('In-memory database seeded successfully.');
                return connMemory;

            } catch (memoryError) {
                console.error(`In-Memory Connection Error: ${(memoryError as Error).message}`);
                console.error('CRITICAL: Could not connect to any database server.');
            }
        }
    }
};

export default connectDB;
