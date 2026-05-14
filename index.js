import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './routes/school.route.js';


const app = express();
const port = process.env.port;


app.use(express.json());
app.use("/api/school",router);


app.listen(port,()=>{
    console.log(`App is listening on ${port}`)
})
