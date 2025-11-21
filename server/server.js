// import express from 'express';
// import fetch from 'node-fetch';
// import FormData from 'form-data';
// import cors from 'cors';
// import 'dotenv/config';

// const app = express();

// // ===== CORS =====
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   'https://lobash1.github.io',
//   'https://lobash1.github.io/Sweet--Chest',
//   'https://sweet-chest.vercel.app',
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error('CORS blocked: ' + origin));
//     },
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

// // нужно для больших base64 картинок
// app.use(express.json({ limit: '10mb' }));

// // ===== Telegram =====
// const BOT_TOKEN = process.env.BOT_TOKEN;
// const CHAT_ID = process.env.CHAT_ID;
// const PORT = process.env.PORT || 3000;

// if (!BOT_TOKEN || !CHAT_ID) {
//   console.error('❌ BOT_TOKEN или CHAT_ID отсутствуют в .env');
//   process.exit(1);
// }

// // ===== /send — заказ =====
// app.post('/send', async (req, res) => {
//   try {
//     const { phone, product } = req.body;

//     if (!phone)
//       return res
//         .status(400)
//         .json({ success: false, message: 'Phone is required' });

//     const caption = `
// 🎀 <b>New Sweet Chest Order!</b>

// 🧁 <b>Dessert:</b> ${product || 'Not specified'}
// 📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
// 🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}

// 🍬 <i>Sweet Chest – handmade desserts with love!</i>
// `;

//     const resp = await fetch(
//       `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: CHAT_ID,
//           text: caption,
//           parse_mode: 'HTML',
//         }),
//       }
//     );

//     const data = await resp.json();
//     if (!data.ok) throw new Error(data.description);

//     res.json({ success: true });
//   } catch (error) {
//     console.error('❌ SEND ERROR:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ===== /upload — фото из модалки =====
// app.post('/upload', async (req, res) => {
//   try {
//     const { phone, image } = req.body;

//     if (!phone || !image) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'Phone and image are required' });
//     }

//     const base64 = image.replace(/^data:image\/\w+;base64,/, '');
//     const buffer = Buffer.from(base64, 'base64');

//     const caption = `
// 🎨 <b>Custom Sweet Chest Order (with photo)</b>

// 📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>
// 🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
// `;

//     const fd = new FormData();
//     fd.append('chat_id', CHAT_ID);
//     fd.append('caption', caption);
//     fd.append('parse_mode', 'HTML');
//     fd.append('photo', buffer, {
//       filename: 'upload.jpg',
//       contentType: 'image/jpeg',
//     });

//     const tgResp = await fetch(
//       `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
//       { method: 'POST', body: fd }
//     );

//     const data = await tgResp.json();
//     if (!data.ok) throw new Error(data.description);

//     res.json({ success: true });
//   } catch (error) {
//     console.error('❌ UPLOAD ERROR:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ===== /ask — вопрос Юлии =====
// app.post('/ask', async (req, res) => {
//   try {
//     const { question, phone } = req.body;

//     if (!question) {
//       return res
//         .status(400)
//         .json({ success: false, message: 'Question is required' });
//     }

//     const caption = `
// 💬 <b>New Question for Julia</b>

// ❓ <b>Question:</b> ${question}
// ${phone ? `📞 <b>Phone:</b> <a href="tel:${phone}">${phone}</a>` : ''}
// 🕐 <b>Received:</b> ${new Date().toLocaleString('uk-UA')}
// `;

//     const resp = await fetch(
//       `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: CHAT_ID,
//           text: caption,
//           parse_mode: 'HTML',
//         }),
//       }
//     );

//     const data = await resp.json();
//     if (!data.ok) throw new Error(data.description);

//     res.json({ success: true });
//   } catch (error) {
//     console.error('❌ ASK ERROR:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // OPTIONS fix
// app.options('*', cors());

// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
import express from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';
import cors from 'cors';
import 'dotenv/config';

const app = express();

/* ===== CORS FIX ===== */
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

/* ===== Проверка токена ===== */
if (!BOT_TOKEN || !CHAT_ID) {
  console.error('❌ BOT_TOKEN или CHAT_ID не указаны в .env!');
}

/* ===== Защита от спама ===== */
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

/* ===== Универсальная отправка в Telegram с повтором ===== */
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
      await new Promise(r => setTimeout(r, 500)); // Повторная попытка
    }
  }
}

/* ===== 1) Заказ из каталога ===== */
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

/* ===== 2) Заявка с фото ===== */
app.post('/upload', async (req, res) => {
  try {
    const { phone, image } = req.body;
    if (!phone || !image) return res.status(400).json({ success: false });

    // Base64 → Binary
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

/* ===== 3) Вопрос Юлии ===== */
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

/* ===== Всегда отдаём CORS при ошибке ===== */
app.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(500).json({ success: false, message: err.message });
});

/* ===== Запуск ===== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
