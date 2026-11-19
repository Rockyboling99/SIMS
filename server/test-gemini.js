
import "dotenv/config";

async function testGemini() {
  console.log("Testing Gemini 2.5 Flash Lite...");

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Balas hanya dengan kata: BERHASIL"
                }
              ]
            }
          ]
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    const data = await response.json();

    console.log("HTTP Status:", response.status);

    if (!response.ok) {
      console.log("Pesan Google:", data.error?.message);
      return;
    }

    console.log(
      "Jawaban Gemini:",
      data.candidates?.[0]?.content?.parts?.[0]?.text
    );

  } catch (error) {
    console.log("Error:", error.message);
  }
}

testGemini();
