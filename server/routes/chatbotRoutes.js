// // routes/chatbotRoutes.js
// For OpenAI Paid Version GPT-3.5 Turbo
// const express = require("express");
// const router = express.Router();
// const axios = require("axios");

// router.post("/", async (req, res) => {
//   const { message } = req.body;
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         // model:"gpt-4"
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: message }],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );
//     res.json({ reply: response.data.choices[0].message.content });
//   } catch (err) {
//     console.error("Chatbot error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Chatbot error" });
//   }
// });

// module.exports = router;
// server/routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { message } = req.body;
  console.log("Message from user:", message);
  let reply = "Sorry, I didn't understand. Please try asking about fever, headache, etc.";

  if (!message) {
    return res.status(400).json({ reply: "Message cannot be empty" });
  }

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("fever")) {
    reply = "For fever, Paracetamol is commonly used. Please consult a doctor.";
  } else if (lowerMessage.includes("headache")) {
    reply = "Try using Crocin or consult your pharmacist.";
  } else if (lowerMessage.includes("cold")) {
    reply = "Antihistamines like cetirizine can help with cold. Stay hydrated!";
  }

  res.json({ reply });
});

module.exports = router;
