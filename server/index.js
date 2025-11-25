require("dotenv").config();
const express = require("express");
const cors = require("cors");

// IMPORTANT FIX ↓↓↓
process.env.OPENAI_API_KEY = "dummy";

const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// HuggingFace Router client
const client = new OpenAI({
  apiKey: process.env.HF_TOKEN,  // HF token
  baseURL: "https://router.huggingface.co/v1",
});

// A chat-supported HF model
const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

app.post("/api/explain", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: `Give a deeply detailed explanation of this code.
Only return plain text with full sentences.
Do NOT use:
- *, -, bullets
- bold text
- markdown
- headings
- code blocks
- lists

Here is the code:
${code}`,
          
        },
      ],
    });

    const explanation =
      completion.choices[0]?.message?.content || "No explanation returned.";

    res.json({ explanation });
  } catch (err) {
    console.error("❌ HF Router Error:", err.response?.data || err.message);
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
});

app.listen(4000, () => {
  console.log("🚀 HF Router Server running on http://localhost:4000");
});
