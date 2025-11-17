import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import 'dotenv/config';

const app = express();

// ✅ Увеличиваем лимит тела запроса до 10 МБ
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Настройка CORS
app.use(
  cors({
    origin: [
      'https://lobash1.github.io',
      'https://lobash1.github.io/Sweet--Chest',
      'https://sweet-chest.vercel.app',
    ],
  })
);

// ✅ Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 МБ
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

// 🔹 Основная форма (без фото)
app.post('/send', async (req, res) => {
  try {
    const { phone, product } = req.body;

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
    console.error('❌ Send error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 Загрузка фото
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { phone } = req.body;
    const file = req.file;

    if (!phone || !file) {
      return res
        .status(400)
        .json({ success: false, message: 'Phone and image are required' });
    }

    const caption = `
🎨 <b>Custom Sweet Chest Order</b>

📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
🍰 <i>Photo attached below for review.</i>
`;

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    formData.append('photo', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.ok) throw new Error(data.description);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
