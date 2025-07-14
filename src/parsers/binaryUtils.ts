// 读取小端16位
export function readUint16LE(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}
// 读取小端32位
export function readUint32LE(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}
// 读取utf16字符串
export function readString(view: DataView, offset: number, length: number) {
  let s = '';
  for (let i = 0; i < length; i += 2) {
    const code = view.getUint16(offset + i, true);
    if (code === 0) break;
    s += String.fromCharCode(code);
  }
  return s;
} 