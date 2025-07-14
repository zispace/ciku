import { parseTxt, TXT_EXTENSIONS } from "./TextParser";
import { parseScel, SCEL_EXTENSIONS } from "./ScelParser";
import { parseYaml, YAML_EXTENSIONS } from "./YamlParser";
import { parsePlist, PLIST_EXTENSIONS } from "./PlistParser";
import { WordEntry } from "../types/WordEntry";

export const PINYIN_SEPARATOR = " ";

export function getAllSupportedExtensions(): string[] {
  return [
    // ...TXT_EXTENSIONS,
    ...SCEL_EXTENSIONS,
    // ...YAML_EXTENSIONS,
    // ...PLIST_EXTENSIONS,
  ];
}

export async function parseByExtension(file: File): Promise<WordEntry[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext) throw new Error("无法识别文件后缀");
  if (TXT_EXTENSIONS.includes(`.${ext}`)) return parseTxt(file);
  if (SCEL_EXTENSIONS.includes(`.${ext}`)) return parseScel(file, PINYIN_SEPARATOR);
  if (YAML_EXTENSIONS.includes(`.${ext}`)) return parseYaml(file);
  if (PLIST_EXTENSIONS.includes(`.${ext}`)) return parsePlist(file);
  throw new Error("不支持的文件类型: " + ext);
}
