import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const LOCALES = ["en", "mn", "cz"];
const FILE_NAME = "common.json";

const getLocalePath = (locale) =>
  path.join(process.cwd(), "src", "i18n", "locales", locale, FILE_NAME);

const readJson = async (filePath) => {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
};

const writeJson = async (filePath, data) => {
  const content = JSON.stringify(data, null, 2) + "\n";
  await fs.writeFile(filePath, content, "utf8");
};

export async function GET() {
  try {
    const data = {};
    for (const locale of LOCALES) {
      data[locale] = await readJson(getLocalePath(locale));
    }
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Failed to load translations." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { data } = payload || {};
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { ok: false, message: "Invalid payload." },
        { status: 400 }
      );
    }

    for (const locale of LOCALES) {
      if (!data[locale] || typeof data[locale] !== "object") {
        return NextResponse.json(
          { ok: false, message: `Missing locale data: ${locale}` },
          { status: 400 }
        );
      }
    }

    for (const locale of LOCALES) {
      await writeJson(getLocalePath(locale), data[locale]);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error?.message || "Failed to save translations." },
      { status: 500 }
    );
  }
}
