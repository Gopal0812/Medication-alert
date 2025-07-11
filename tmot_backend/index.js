import express from 'express';
import { dbConect } from './config/db.js';
import cors from 'cors';
import 'dotenv/config'
import userRoutes from './routes/UserRoutes.js';
import medicationRoutes from './routes/medicationRoutes.js';
import './crons/cronJon.js'; // Import cron job


const app = express();
const port = 8082;
app.use(express.json())
app.use(cors())
// app.use(express.urlencoded({ extended: false }));




app.use('/api', userRoutes);


app.use('/api', medicationRoutes)


//db connection
dbConect();


app.listen(port, () => {
    console.log(`port running on ${port}`);
});
