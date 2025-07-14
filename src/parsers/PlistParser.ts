import { WordEntry } from "../types/WordEntry";
// import plist from "plist";

export const PLIST_EXTENSIONS = [".plist"];

export async function parsePlist(file: File): Promise<WordEntry[]> {
  // const text = await file.text();
  // const data = plist.parse(text) as any;
  // TODO: 按Apple词库格式解析
  return [];
}
