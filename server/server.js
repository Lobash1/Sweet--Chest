import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(
  cors({
    origin: [
      'https://lobash1.github.io',
      'https://lobash1.github.io/Sweet--Chest',
      'https://sweet-chest.vercel.app',
    ],
  })
);
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ BOT_TOKEN или CHAT_ID не заданы в .env');
}

app.post('/send', async (req, res) => {
  try {
    const { phone, product, image } = req.body;

    const caption = `
🎀 <b>New Sweet Chest Order!</b>

🧁 <b>Dessert:</b> ${product || 'Not specified'}
👩‍💻 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}

🍬 <i>Sweet Chest – handmade desserts with love!</i>
    `;

    let telegramResponse;

    if (image) {
      const resp = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.CHAT_ID,
            photo: image,
            caption,
            parse_mode: 'HTML',
          }),
        }
      );
      telegramResponse = await resp.json();
    } else {
      const resp = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.CHAT_ID,
            text: caption,
            parse_mode: 'HTML',
          }),
        }
      );
      telegramResponse = await resp.json();
    }

    console.log('📤 Ответ Telegram:', telegramResponse);

    if (!telegramResponse.ok) {
      throw new Error(telegramResponse.description || 'Telegram API error');
    }

    // ✅ возвращаем success на фронт
    res.json({ success: true, telegram: telegramResponse });
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
