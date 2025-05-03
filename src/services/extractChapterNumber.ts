export function extractChapterNumber(chapterTitle: string): {
  raw: string;
  number: number;
} {
  // Regex para encontrar o número com possível ponto decimal
  const match = chapterTitle.match(/\d+(\.\d+)?/);

  if (match) {
    const raw = match[0]; // ex: '01', '00.5'
    const number = parseFloat(raw); // ex: 1, 0.5
    return { raw, number };
  }

  return { raw: "0", number: 0 };
}
