/**
 * 截图入库前压缩：最长边 ≤1000px，JPEG quality 0.72，输出 dataURL。
 */

const MAX_SIDE = 1000;
const JPEG_QUALITY = 0.72;

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片读取失败'));
    };
    img.src = url;
  });
}

/** 压缩图片文件 → JPEG dataURL；非图片或解析失败时抛出异常 */
export async function compressImage(file: Blob): Promise<string> {
  const img = await loadImage(file);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) throw new Error('图片尺寸无效');
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('画布不可用');
  // JPEG 无透明通道，先铺纸色底避免 PNG 透明截图变黑
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

/** 批量压缩，跳过失败项，返回成功的 dataURL 列表 */
export async function compressImages(files: (File | Blob)[]): Promise<string[]> {
  const out: string[] = [];
  for (const f of files) {
    try {
      out.push(await compressImage(f));
    } catch {
      /* 单个失败不阻塞其余图片 */
    }
  }
  return out;
}
