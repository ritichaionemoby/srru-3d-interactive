#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith("--"));
const profileArg = args.find((arg) => arg.startsWith("--profile="));
const profile = profileArg?.slice("--profile=".length) || "teacher-external";
const supportedProfiles = new Set(["teacher-external", "dev-workspace"]);

if (!input) {
  console.error("Usage: node validator/validate-lesson.mjs <lesson.html> [--profile=teacher-external|dev-workspace]");
  process.exit(1);
}

if (!supportedProfiles.has(profile)) {
  console.error(`Unknown profile: ${profile}`);
  process.exit(1);
}

const file = resolve(input);
const errors = [];
const add = (code, stage, message, details = "") => errors.push({ code, stage, message, details });
let html = "";
let standardAssetIds = new Set();

try {
  const catalogText = await readFile(new URL("../sdk/asset-library.catalog.json", import.meta.url), "utf8");
  const catalog = JSON.parse(catalogText);
  standardAssetIds = new Set(Object.keys(catalog.assets || {}));
} catch (error) {
  add("SDK_CATALOG_INVALID", "validator", `อ่าน Standard Asset catalog ไม่ได้: ${error.message}`);
}

try {
  html = await readFile(file, "utf8");
} catch (error) {
  add("LESSON_FETCH_FAILED", "read", `อ่านไฟล์ไม่ได้: ${error.message}`);
}

if (html) {
  if (!/^\s*<!doctype html>/i.test(html)) add("LESSON_HTML_INVALID", "parse", "ต้องเริ่มด้วย <!doctype html>");
  if (!/<html\b[^>]*\blang=["']th["'][^>]*>/i.test(html)) add("LESSON_HTML_INVALID", "parse", "ต้องมี <html lang=\"th\">");
  if (!/<meta\s+charset=["']?UTF-8["']?\s*\/?\s*>/i.test(html)) add("LESSON_HTML_INVALID", "parse", "ต้องมี meta charset UTF-8");

  const scripts = [...html.matchAll(/<script\b[^>]*\bdata-lesson-app\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if (!scripts.length) add("LESSON_APP_SCRIPT_MISSING", "parse", "ไม่พบ script[data-lesson-app]");
  if (scripts.length > 1) add("LESSON_APP_SCRIPT_DUPLICATE", "parse", `พบ script[data-lesson-app] ${scripts.length} ตัว`);

  const defineCount = (html.match(/\bPuzzleLesson\s*\.\s*define\s*\(/g) || []).length;
  if (!defineCount) add("LESSON_DEFINE_MISSING", "register", "ไม่พบ PuzzleLesson.define(...)");
  if (defineCount > 1) add("LESSON_DEFINE_DUPLICATE", "register", `พบ PuzzleLesson.define ${defineCount} ครั้ง`);

  const forbidden = [
    [/<script\b[^>]*\bsrc\s*=/i, "external script"],
    [/<(?:iframe|canvas|form|button|main|header|section)\b/i, "standalone UI markup"],
    [/<(?:style|link)\b/i, "lesson CSS/stylesheet"],
    [/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/, "network request"],
    [/\bimport\s*(?:\(|[\w*{])/, "import"],
    [/\bTHREE\s*\./, "THREE internal API"],
    [/\bwindow\s*\.\s*(?:context|eduSdk)\b/, "runtime global"],
    [/\b(?:spawnObject|removeObject|updateObject)\s*\(/, "unsupported invented API"]
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(html)) add("LESSON_API_NOT_SUPPORTED", "validate", `ห้ามใช้ ${label}`);
  }

  if (profile === "teacher-external") {
    const externalAssetPatterns = [
      [/\.\s*addModel\s*\(/, "world.addModel()"],
      [/\btype\s*:\s*["']model["']/, "addObject type: model"],
      [/\b(?:path|texture)\s*:\s*["'](?:\.\.?\/|assets\/)/i, "direct asset path"]
    ];
    for (const [pattern, label] of externalAssetPatterns) {
      if (pattern.test(html)) {
        add(
          "LESSON_EXTERNAL_ASSET_FORBIDDEN",
          "validate",
          `TEACHER_EXTERNAL ห้ามใช้ ${label}; ใช้ primitive หรือ Standard Asset ID ใน catalog เท่านั้น`
        );
      }
    }

    for (const match of html.matchAll(/\basset\s*:\s*["']([^"']+)["']/g)) {
      if (!standardAssetIds.has(match[1])) {
        add(
          "LESSON_ASSET_NOT_FOUND",
          "validate",
          `ไม่พบ Standard Asset ID: ${match[1]}`,
          "เลือก ID จาก sdk/asset-library.catalog.json เท่านั้น"
        );
      }
    }
  }

  const unsupportedOperator = html.match(/\.addOperatorSign\s*\(\s*{[\s\S]{0,240}?\btext\s*:\s*["']([^"']+)["']/);
  if (unsupportedOperator && !["<", ">", "="].includes(unsupportedOperator[1])) {
    add("LESSON_OPERATOR_UNSUPPORTED", "validate", `addOperatorSign ไม่รองรับ ${unsupportedOperator[1]}; ใช้ addText3D สำหรับเครื่องหมายทั่วไป`);
  }

  const requiredPatterns = [
    [/\bid\s*:\s*["'][^"']+["']/, "id"],
    [/\bversion\s*:\s*["'][^"']+["']/, "version"],
    [/\bmeta\s*:\s*{/, "meta"],
    [/\bworldType\s*:\s*["']3d-world-space["']/, "meta.worldType"],
    [/\blessonId\s*:\s*["'][^"']+["']/, "meta.lessonId"],
    [/\bmount\s*\([^)]*\)\s*{/, "mount(context)"],
    [/\breset\s*\([^)]*\)\s*{/, "reset(payload)"],
    [/\bonStep\s*\([^)]*\)\s*{/, "onStep(index, step)"],
    [/\bdispose\s*\([^)]*\)\s*{/, "dispose()"]
  ];
  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(html)) add("LESSON_LIFECYCLE_MISSING", "validate", `ไม่พบ ${label}`);
  }

  if (scripts.length === 1) {
    try {
      new Function(scripts[0][1]);
    } catch (error) {
      add("LESSON_SCRIPT_SYNTAX_ERROR", "compile", error.message);
    }
  }
}

const report = {
  ok: errors.length === 0,
  file: basename(file),
  contractVersion: "1.1.0",
  profile,
  errors
};

if (errors.length) {
  report.userMessage = "นำข้อความนี้ส่งต่อให้ผู้พัฒนาบทเรียน หรือส่งเข้า AI Agent เพื่อแก้ไขข้อผิดพลาด";
  report.repairPrompt = [
    "ซ่อมเฉพาะไฟล์ lesson ที่แนบมา ห้ามแก้ runtime, SDK, settings หรือ CSS",
    "อ่าน AgentLesson README, contract, Public API, output template และ lesson0 ก่อนซ่อม",
    ...errors.map(error => `${error.code} [${error.stage}]: ${error.message}${error.details ? ` — ${error.details}` : ""}`),
    "คืนเฉพาะชื่อไฟล์และ HTML code block ที่แก้สมบูรณ์แล้วหนึ่ง block"
  ].join("\n");
}

console.log(JSON.stringify(report, null, 2));
process.exit(errors.length ? 1 : 0);
