
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "v1beta",
  },
});

app.post("/api/analyze-thesis", async (req, res) => {
  try {
    const { title, abstract, keywords } = req.body;

    if (
      !title ||
      !abstract ||
      !Array.isArray(keywords) ||
      keywords.length === 0
    ) {
      return res.status(400).json({
        message: "Judul, abstrak, dan kata kunci wajib diisi.",
      });
    }

    const prompt = `
Kamu adalah asisten akademik untuk membantu analisis topik skripsi.

Analisis informasi skripsi berikut:

Judul: ${title}
Abstrak: ${abstract}
Kata kunci: ${keywords.join(", ")}

Tugas:
1. Identifikasi kategori penelitian utama.
2. Identifikasi bidang keahlian yang relevan.
3. Jelaskan alasan klasifikasi berdasarkan informasi yang diberikan.

Jangan merekomendasikan nama dosen.
Jangan membuat informasi yang tidak terdapat dalam data.

Berikan jawaban dalam format JSON:
{
  "categories": ["kategori 1", "kategori 2"],
  "relevantExpertise": ["keahlian 1", "keahlian 2"],
  "reasoning": "alasan klasifikasi"
}
`;

    console.log("Mengirim permintaan ke Gemini 2.5 Flash Lite...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    console.log("Respons Gemini diterima.");

    const result = JSON.parse(response.text);

    res.json(result);
  } catch (error) {
    console.error("Gemini API Error:", error);

    res.status(500).json({
      message: "Gagal menganalisis skripsi dengan AI.",
      detail: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini backend berjalan di http://localhost:${PORT}`);
});
