import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// ===== CORS =====
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lobash1.github.io',
  'https://lobash1.github.io/Sweet--Chest',
  'https://sweet-chest.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS blocked: ' + origin));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// нужно для больших base64 картинок
app.use(express.json({ limit: '10mb' }));

// ===== Telegram =====
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ BOT_TOKEN или CHAT_ID отсутствуют в .env');
  process.exit(1);
}

// ===== /send — заказ =====
app.post('/send', async (req, res) => {
  try {
    const { phone, product } = req.body;

    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: 'Phone is required' });

    const caption = `
🎀 <b>New Sweet Chest Order!</b>

🧁 <b>Dessert:</b> ${product || 'Not specified'}
📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}

🍬 <i>Sweet Chest – handmade desserts with love!</i>
`;

    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: caption,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await resp.json();
    if (!data.ok) throw new Error(data.description);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ SEND ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== /upload — фото из модалки =====
app.post('/upload', async (req, res) => {
  try {
    const { phone, image } = req.body;

    if (!phone || !image) {
      return res
        .status(400)
        .json({ success: false, message: 'Phone and image are required' });
    }

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const caption = `
🎨 <b>Custom Sweet Chest Order (with photo)</b>

📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
`;

    const fd = new FormData();
    fd.append('chat_id', CHAT_ID);
    fd.append('caption', caption);
    fd.append('parse_mode', 'HTML');
    fd.append('photo', buffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg',
    });

    const tgResp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      { method: 'POST', body: fd }
    );

    const data = await tgResp.json();
    if (!data.ok) throw new Error(data.description);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ UPLOAD ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== /ask — вопрос Юлии =====
app.post('/ask', async (req, res) => {
  try {
    const { question, phone } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: 'Question is required' });
    }

    const caption = `
💬 <b>New Question for Julia</b>

❓ <b>Question:</b> ${question}
${phone ? `📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>` : ''}
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
`;

    const resp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: caption,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await resp.json();
    if (!data.ok) throw new Error(data.description);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ ASK ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// OPTIONS fix
app.options('*', cors());

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
