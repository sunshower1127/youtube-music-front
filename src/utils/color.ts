function hexToRGB(hex: string) {
  if (hex.length !== 6) {
    throw new Error("유효하지 않은 HEX 값입니다.");
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHue(r: number, g: number, b: number) {
  // 0~1 범위로 정규화
  const rNorm = r / 255,
    gNorm = g / 255,
    bNorm = b / 255;
  const cMax = Math.max(rNorm, gNorm, bNorm);
  const cMin = Math.min(rNorm, gNorm, bNorm);
  const delta = cMax - cMin;

  if (delta === 0) return 0; // 채도가 0이면 hue 값은 0

  let hue;
  if (cMax === rNorm) {
    hue = ((gNorm - bNorm) / delta) % 6;
  } else if (cMax === gNorm) {
    hue = (bNorm - rNorm) / delta + 2;
  } else {
    // cMax === bNorm
    hue = (rNorm - gNorm) / delta + 4;
  }
  hue *= 60;
  if (hue < 0) hue += 360;
  return hue;
}

export function hexToHue(hex: string) {
  const { r, g, b } = hexToRGB(hex);
  return rgbToHue(r, g, b);
}
