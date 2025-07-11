import { dbConect } from './config/db.js'
import mongoose from 'mongoose'

async function testConnection() {
    try {
        console.log('Testing database connection...');
        
        await dbConect();
        
        console.log('✅ Database connection successful!');
        
        // Test a simple query
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

testConnection(); 