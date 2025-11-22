import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import 'dotenv/config';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://lobash1.github.io',
  'https://lobash1.github.io/Sweet--Chest',
  'https://sweet-chest.vercel.app',
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ BOT_TOKEN или CHAT_ID не указаны в .env!');
}

const requests = new Map();
function antiSpam(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const last = requests.get(ip);
  if (last && Date.now() - last < 4000) {
    return res
      .status(429)
      .json({ success: false, message: 'Too many requests' });
  }
  requests.set(ip, Date.now());
  next();
}

app.use(antiSpam);

async function sendToTelegram(url, body, isForm = false, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        ...(isForm
          ? { body }
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            }),
      });
      const data = await resp.json();
      if (data.ok) return data;
      throw new Error(data.description);
    } catch (err) {
      if (i === tries - 1) throw err;
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

app.post('/send', async (req, res) => {
  try {
    const { phone, product } = req.body;

    const caption = `
🎀 <b>New Sweet Chest Order!</b>

🧁 <b>Dessert:</b> ${product || 'Not specified'}
📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
`;

    const data = await sendToTelegram(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      { chat_id: CHAT_ID, text: caption, parse_mode: 'HTML' }
    );

    res.json({ success: true, telegram: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/upload', async (req, res) => {
  try {
    const { phone, image } = req.body;
    if (!phone || !image) return res.status(400).json({ success: false });

    const buffer = Buffer.from(image.split(';base64,').pop(), 'base64');
    const caption = `
🎨 <b>Custom Order Request</b>
📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 ${new Date().toLocaleString('uk-UA')}
`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    formData.append('photo', buffer, {
      filename: 'order.jpg',
      contentType: 'image/jpeg',
    });

    const data = await sendToTelegram(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      formData,
      true
    );

    res.json({ success: true, telegram: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/ask', async (req, res) => {
  try {
    const { phone, question } = req.body;
    const caption = `
💬 <b>Question for Julia!</b>

❓ <b>Message:</b> ${question}
📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 ${new Date().toLocaleString('uk-UA')}
`;

    const data = await sendToTelegram(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      { chat_id: CHAT_ID, text: caption, parse_mode: 'HTML' }
    );

    res.json({ success: true, telegram: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
