# Changelog

## 2026-09-11 — 0.1.0 Procedural Geometry First

- เพิ่ม Public Procedural Geometry เป็น 32 รูปทรง พร้อมตัวเลือกมุม จำนวนด้าน รัศมีด้านใน และความละเอียด
- เพิ่ม `sector`/`ring-sector` สำหรับแบ่งเค้ก พิซซ่า เศษส่วน และกราฟวงกลมอย่างเท่ากันโดยไม่ใช้โมเดลใหม่
- เพิ่ม prism, pyramid, frustum, capsule, polyhedra และรูปทรงตกแต่งสำหรับทำ lesson prototype ให้จบจาก HTML ไฟล์เดียว
- เพิ่มกฎ Procedural First: AI ภายนอกต้องลองประกอบจาก `addPrimitive`/`addGroup` ก่อนขอ Asset หรือติดต่อทีม Dev
- อัปเดต SDK 3.0.0, Lesson Contract 1.3.0, types, capabilities, validator และ regression tests

## 2026-09-08 — 0.0.9 เพิ่ม CHECK, FEEDBACK และ IDEA

- `--CHECK` ตรวจ Lesson HTML และรายงาน Passed/Warning/Error/Fix/Verdict
- `--FEEDBACK` วิเคราะห์งานล่าสุดและจัดลำดับแนวทางพัฒนา interactive
- `--IDEA <หัวข้อ>` เสนอแนวคิดเริ่มต้น 5 แบบก่อนสร้างจริง
- เพิ่มคู่มือทั้งใน `AI/*.md` และ public entrypoint ภายใต้ `git/`

## 2026-09-08 — 0.0.8 เพิ่ม DEFINE MAP

- เพิ่มเมนู `--DEFINE` สำหรับตั้งชื่อพื้นที่ วัตถุ GUI และ logic ของบทเรียน
- เพิ่ม `git/DEFINE` ซึ่งวิเคราะห์ HTML ล่าสุดใน Chat โดยไม่แก้ไฟล์
- ชื่อ `[Defined Name]` ใช้อ้างอิงจุดแก้ในข้อความถัดไปและ refresh ได้เมื่อโครงสร้างเปลี่ยน

## 2026-09-08 — 0.0.7 ส่งบทเรียนผ่าน Chat

- กำหนด `git/DEVGEN` เป็น GitHub read-only workflow
- `--CREATE` ส่งชื่อ path และ Lesson Package HTML ฉบับเต็มใน code block สำหรับ Copy
- ห้ามพยายามเขียนไฟล์, commit, branch, pull request หรือ push กลับ Repository
- หากไม่มี validator ให้ทำ static self-review และรายงานตามจริงแทนการหยุดที่ `403`

## 2026-09-07 — 0.0.6 แยก Connection ออกจาก Lesson

- คำสั่ง Introduction ใช้เพียง Repository และ `git/DEVGEN`
- ย้าย `[ Lesson ]` ไปถามเมื่อเริ่ม `--CREATE` หรือแสดงผ่าน `--TEMPLATE`
- คำตอบแรกยืนยันโครงสร้างและพร้อมรับคำสั่ง โดยยังไม่กำหนดไฟล์ปลายทาง

## 2026-09-07 — 0.0.5 เพิ่ม DEVGEN MENU

- คำตอบแรกของ session แสดง `--CREATE`, `--TEMPLATE`, `--TOOLS` และ `--HELP`
- `--TEMPLATE` ส่ง Brief แบบ copy ได้ ส่วน `--TOOLS` และ `--HELP` อ้างจากไฟล์จริง
- ข้อความทั่วไปที่ไม่มีชื่อเมนูถูกตีความเป็น `--CREATE` โดยอัตโนมัติ

## 2026-09-07 — 0.0.4 เพิ่ม DEVGEN สำหรับทีมภายนอก

- เพิ่ม `git/DEVGEN` สำหรับตรวจ Repository, อ่าน Master และถาม Brief ก่อนสร้าง
- เพิ่ม `DEVGEN` ที่ root เป็น entrypoint สำรองเพื่อช่วยให้ค้นพบคำสั่งได้ง่าย
- ลด START_PROMPT ภายนอกเหลือ Repository, Introduction และ Lesson path

## 2026-09-07 — 0.0.3 แก้ปุ่ม Back ของ UI บนมือถือ

- ปุ่ม Back มุมซ้ายบนรับการแตะตั้งแต่ `pointerdown` จึงไม่ค้างเมื่อ browser ยกเลิก `click` ระหว่าง gesture
- กัน event `click` ที่ตามหลัง touch ไม่ให้ส่งคำสั่งปิดซ้ำ
- ขยายพื้นที่แตะของปุ่มโดยไม่เปลี่ยนขนาดที่มองเห็น และใช้ได้ทั้งหน้า Loading กับหน้าบทเรียน

## 2026-09-07 — 0.0.2 ตรวจ helper ที่ไม่มีจริง

- เพิ่ม `LESSON_HELPER_MISSING` ใน validator เพื่อจับ `this.someHelper()` ที่ไม่มี method ใน lesson definition ก่อนเปิด runtime
- ระบุใน START_PROMPT, README, Master, contract, testing และ template ว่า `this.*` เป็น helper ของบทเรียน ไม่ใช่ Public API
- ปรับ runtime failure popup ให้ระบุชื่อ helper ที่ขาดและแนวทางซ่อมโดยตรง
- sync source snapshot และ hash กับ working tree ล่าสุด

## 2026-09-07 — รวมชุดสร้างบทเรียนภายนอกเป็น Github

- รวมคู่มือ, Master, SDK, GUI examples, contract/schema, types, template, validator และ source snapshot ไว้ที่ root ของ repo
- ย้าย START_PROMPT ไปเป็นไฟล์ข้อความนอก repo ที่ผู้มอบหมายส่งแยก ไม่เผยแพร่พร้อม source
- รวม workflow CREATE/REPAIR, self-review, error-report และการคืน HTML ฉบับเต็มจากชุด authoring เดิม
- ใช้ README เป็นจุดเริ่มเดียว รวมวิธีมอบหมายและ sync จึงลบคู่มือคน/คู่มืออัปโหลดที่ซ้ำกัน
- ลบชุด authoring เดิมจากโปรเจกต์เจ้าของและปรับเอกสารภายในให้ชี้มาชุด Github
- เก็บ source สำหรับอ่านและ static checks ไม่รวม plugin หรือ asset binary; runtime test ใช้ระบบปลายทาง

Source snapshot ระบุที่มาและ hash ใน SOURCE_MANIFEST.json
