#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const input = process.argv[2];

if (!input) {
  console.error("Usage: node validator/validate-lesson.mjs <lesson.html>");
  process.exit(1);
}

const file = resolve(input);
const errors = [];
const add = (code, stage, message, details = "") => errors.push({ code, stage, message, details });
let html = "";

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
  contractVersion: "1.0.0",
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

