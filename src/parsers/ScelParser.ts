import { WordEntry } from "../types/WordEntry";
import { readUint16LE, readUint32LE, readString } from "./binaryUtils";

export const SCEL_EXTENSIONS = [".scel", ".qcel"]; // 搜狗、QQ（新版）输入法词库

/*
搜狗输入法
- 词库网址: https://pinyin.sogou.com/dict/
- 文件后缀: .scel

文件格式
范围	描述
0x000 - 0x11F	未知
0x120 - 0x123	a, 不展开重码的词条数（编码数）
0x124 - 0x127	b, 展开重码的词条数（词数）
0x128 - 0x12B	未知，和 a 有关
0x12C - 0x12F	未知，和 b 有关
0x130 - 0x337	词库名
0x338 - 0x53F	词库类型
0x540 - 0xD3F	备注/描述信息
0xD40 - 0x153F	示例词
0x1540 拼音表的长度(前两字节)
0x1544 拼音表正文（索引 + 长度 + 拼音编码）
0x2628 词库正文
*/
export async function parseScel(file: File, pySep: string): Promise<WordEntry[]> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(buf.buffer);
  const step = 2;

  let offset = 0;

  // 1. 解析拼音表
  // 拼音表偏移一般为0x1540，先定位到拼音表，大约413组； qcel会多26个大写字母
  const pyTableOffset = 0x1540;
  const pyTable: Record<number, string> = {};
  offset = pyTableOffset;
  const pyTableLen = readUint32LE(view, offset);
  offset += step * 2;

  for (let i = 0; i < pyTableLen; i++) {
    const index = readUint16LE(view, offset);
    const pyLen = readUint16LE(view, offset + step);
    const py = readString(view, offset + step * 2, pyLen);
    pyTable[index] = py;
    offset += step * 2 + pyLen;
  }
  console.log("pyTable", Object.keys(pyTable).length, offset)

  // 2. 解析词条表
  // 词条表偏移一般为0x2628 拼音表之后就是词汇
  // const wordTableOffset = 0x2628;
  // offset = wordTableOffset;
  const words: WordEntry[] = [];
  while (offset < buf.length) {
    // 2字节，同音词数量
    if (offset + step > buf.length) break;
    const same = readUint16LE(view, offset);
    offset += step;
    if (same === 0) break;

    // 2字节，拼音索引表长度
    if (offset + step > buf.length) break;
    const pyLen = readUint16LE(view, offset);
    offset += step;

    // 拼音索引表
    const pyIdxs: number[] = [];
    for (let i = 0; i < pyLen / 2; i++) {
      if (offset + step > buf.length) break;
      pyIdxs.push(readUint16LE(view, offset));
      offset += step;
    }
    const pinyin = pyIdxs.map(idx => pyTable[idx]).join(pySep);

    // 解析同音词组下的所有词
    for (let i = 0; i < same; i++) {
      if (offset + step > buf.length) break;
      const wordLen = readUint16LE(view, offset);
      offset += step;
      if (offset + wordLen > buf.length) break;
      const word = readString(view, offset, wordLen);
      offset += wordLen;

      if (offset + step > buf.length) break;
      const extLen = readUint16LE(view, offset);
      offset += step;

      // 权重（部分scel有，部分没有）
      let weight: number | undefined = undefined;
      if (extLen >= 4 && offset + step <= buf.length) {
        weight = readUint16LE(view, offset);
      }
      offset += extLen;

      words.push({ word, pinyin, weight });
    }
    if (offset >= buf.length) break;
  }

  // 日志
  console.log('[SCEL] 解析完成，词条数量:', words.length);
  if (words.length > 0) {
    console.log('[SCEL] 前5个词条示例:', words.slice(0, 5));
  }
  return words;
}
