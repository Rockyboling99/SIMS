
export function matchLecturers(aiAnalysis, lecturers) {
  if (
    !aiAnalysis ||
    !Array.isArray(aiAnalysis.relevantExpertise) ||
    !Array.isArray(lecturers)
  ) {
    return [];
  }

  const aiExpertise = aiAnalysis.relevantExpertise.map((item) =>
    item.toLowerCase().trim()
  );

  return lecturers
    .map((lecturer) => {
      const expertise = (lecturer.expertise || []).map((item) =>
        item.toLowerCase().trim()
      );

      const research = (lecturer.research || []).map((item) =>
        item.toLowerCase().trim()
      );

      const matchedExpertise = aiExpertise.filter((item) =>
        expertise.includes(item)
      );

      const matchedResearch = aiExpertise.filter((item) =>
        research.some((topic) => topic.includes(item))
      );

      const score =
        matchedExpertise.length * 2 + matchedResearch.length;

      return {
        ...lecturer,
        score,
        matchedExpertise,
        matchedResearch,
      };
    })
    .filter((lecturer) => lecturer.score > 0)
    .sort((a, b) => b.score - a.score);
}
