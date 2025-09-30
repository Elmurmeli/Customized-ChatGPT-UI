import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages
        })
    });

    const data = await response.json();
    res.json(data);
    } catch (err) {
        res.status(500).json({error:err.message });
    }
});

app.listen(5000, () => console.log("Backend running on http://localhost5000"));