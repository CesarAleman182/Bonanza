import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async () => {
    try{
        const dbURI = process.env.MONGODB_URI;
        const dbName = proccess.env.MONGOD_DB;

        await mongoose.connect(`${dbURI}/${dbName}`);

        console.log('MongoDB is connected');
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default dbConnection;