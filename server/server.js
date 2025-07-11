import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config(); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    message: '🚀 Gemini Flash 2.5 server is running!',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).send({
      bot: text,
    });
  } catch (error) {
    console.error('❌ Gemini Flash Error:', error);
    res.status(500).send(error?.message || 'Something went wrong on the server.');
  }
});

app.listen(5000, () => console.log('✅ Gemini Flash server running on http://localhost:5000'));
