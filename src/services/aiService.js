
export async function analyzeThesis(thesis) {
  const response = await fetch(
    "http://localhost:3001/api/analyze-thesis",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: thesis.title,
        abstract: thesis.abstract,
        keywords: thesis.keywords,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Gagal menganalisis skripsi dengan AI."
    );
  }

  return result;
}
