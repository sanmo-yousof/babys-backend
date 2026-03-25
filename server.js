import dotenv from 'dotenv';
import {app} from './src/app.js';
import connectMongoDB from './src/config/db.js';
dotenv.config();

const PORT = process.env.PORT || 5000;


// mongoDB connection 
connectMongoDB()



app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
});

