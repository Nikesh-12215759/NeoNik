const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
//const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: message }] }]
    });

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ reply });

  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API call failed" });
  }
});

const PORT =5050;
app.listen(PORT, () => {
  console.log(`✅ Gemini Chatbot server running at http://localhost:${PORT}`);
});
