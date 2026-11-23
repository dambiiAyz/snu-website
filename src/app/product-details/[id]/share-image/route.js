import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import config from "../../../../../next.config";
import { getShareProduct, getShareImage } from "../share-product";

async function readImage(source) {
  const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://snuu.mn");
  const url = new URL(source, site);
  if (url.origin === site.origin && /^\/assets\/img\/[\w./-]+$/.test(url.pathname)) {
    return readFile(path.join(process.cwd(), "public", url.pathname));
  }
  const allowed = config.images.remotePatterns.some(({ hostname }) => hostname === url.hostname);
  if (!allowed || url.protocol !== "https:" || url.port) throw new Error("Unsupported image host");
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
  if (!response.ok) throw new Error("Image unavailable");
  const chunks = [];
  let length = 0;
  for await (const chunk of response.body) {
    length += chunk.length;
    if (length > 20 * 1024 * 1024) throw new Error("Image too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await getShareProduct(id);
  if (!product) return new Response(null, { status: 404 });
  try {
    const source = await readImage(getShareImage(product));
    const image = await sharp(source, { limitInputPixels: 50000000 })
      .rotate()
      .resize(1200, 630, { fit: "contain", background: "white" })
      .flatten({ background: "white" })
      .jpeg({ quality: 90 })
      .toBuffer();
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
