import { WordEntry } from "../types/WordEntry";
// import yaml from "js-yaml";

export const YAML_EXTENSIONS = [".yaml", ".yml"];

export async function parseYaml(file: File): Promise<WordEntry[]> {
  // const text = await file.text();
  // const doc = yaml.load(text) as any;
  // TODO: 按Rime格式解析
  return [];
}
