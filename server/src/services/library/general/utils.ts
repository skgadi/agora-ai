export function padLeft(num: number, size: number): string {
  let s = String(num);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}
