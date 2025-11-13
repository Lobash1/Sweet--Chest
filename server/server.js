import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
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

app.post('/upload', async (req, res) => {
  try {
    const { phone, image } = req.body;

    if (!phone || !image) {
      return res
        .status(400)
        .json({ success: false, message: 'Phone and image are required' });
    }

    // 🔍 Декодируем base64
    const base64Data = image.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    const caption = `
🎨 <b>Custom Sweet Chest Order</b>

📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}

🍰 <i>Photo attached below for review.</i>
    `;

    // 📦 Создаём форму для Telegram (чтобы передать фото как файл)
    const formData = new FormData();
    formData.append('chat_id', process.env.CHAT_ID);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    formData.append('photo', buffer, {
      filename: 'order.jpg',
      contentType: 'image/jpeg',
    });

    // 🚀 Отправляем в Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    console.log('📤 Telegram upload response:', data);

    if (!data.ok) throw new Error(data.description || 'Telegram API error');

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
