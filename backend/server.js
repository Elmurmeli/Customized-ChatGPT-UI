import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Toggle between mock mode and real API
const USE_MOCK = process.env.USE_MOCK === "true";

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (USE_MOCK) {
    // --- Mock reply mode ---
    console.log("Mock mode active, returning fake response.");
    return res.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: "Hello! This is a mock response from the assistant.",
          },
        },
      ],
    });
  }

  // --- Real API mode ---
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data);

    res.json(data);
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);