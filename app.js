import 'dotenv/config';
import express from 'express';
import cors from "cors"; 
import chatRoute from './routes/chat.js';

const app = express();

app.use(cors());   
app.use(express.json());

app.use('/chat', chatRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
