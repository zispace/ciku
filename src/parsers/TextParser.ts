import { WordEntry } from "../types/WordEntry";

export const TXT_EXTENSIONS = [".txt"];

export async function parseTxt(file: File): Promise<WordEntry[]> {
  const text = await file.text();
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [word, pinyin, weight] = line.split(/\s+/);
      return { word, pinyin, weight: weight ? Number(weight) : undefined };
    });
}
