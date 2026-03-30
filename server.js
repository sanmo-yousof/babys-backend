import dotenv from 'dotenv';
import {app} from './src/app.js';
import os from 'os'
import connectMongoDB from './src/config/db.js';
dotenv.config();

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
}

const PORT = process.env.PORT || 5000;
const localIP = getLocalIP();



// mongoDB connection 
connectMongoDB()



app.listen(PORT,'0.0.0.0',() => {
    console.log(`server running on port ${PORT}`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://${localIP}:${PORT}`);
});

