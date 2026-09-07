# Puzzle Widget — Repository อ้างอิงสำหรับ AI สร้างบทเรียน

Repository นี้รวมคู่มือ, Public API, ตัวอย่าง GUI และ source snapshot ที่จำเป็นไว้ในที่เดียว เพื่อให้ทีม Dev / AI อ่านแล้วผลิตบทเรียน HTML ที่ใช้ระบบกลางของเจ้าของโครงการได้

**นี่คือชุดอ่านและตรวจ static ไม่ใช่เว็บพร้อมรัน** ตั้งใจไม่รวม plugin, vendor dependency, รูป, โมเดล, เสียง หรือ asset binary จึงไม่ต้องติดตั้งหรือขอสิ่งเหล่านี้เพื่อเริ่มสร้างบทเรียน ใช้ Asset ID จาก catalog ได้ เพราะระบบปลายทางเป็นผู้จัดเตรียมไฟล์จริง

## จุดเริ่มต้นสำหรับ AI

1. อ่าน [MASTER_README.md](MASTER_README.md) ทั้งไฟล์ — กฎหลัก, lifecycle, Lab, Quiz และขอบเขตงาน
2. อ่าน [contract](contracts/LESSON_CONTRACT.md) และ [template](LESSON_OUTPUT_TEMPLATE.html) — รูปแบบ HTML หนึ่งไฟล์
3. อ่าน [Public API](sdk/LESSON_API_REFERENCE.md), [UI Catalog](sdk/UI_CATALOG.md), [ตัวอย่าง GUI Service ครบทุกกลุ่ม](sdk/GUI_SERVICE_REFERENCE.md) และตรวจ signature ใน [types](sdk/lesson-sdk.d.ts)
4. ตรวจ [capabilities](sdk/capabilities.json) และ [Asset catalog](Project/interactive/assets/library/catalog.json) — ห้ามเดา API หรือ Asset ID
5. อ่าน [Lesson 0](Project/interactive/chapters/lesson0.html) ทั้งไฟล์ แล้วเลือกตัวอย่างใกล้กิจกรรมใหม่ 1–2 บทจาก [EXAMPLES.md](EXAMPLES.md) หรือ [examples.json](examples.json)
6. ตรวจ source เฉพาะบริการที่ใช้จาก [main-world.js](Project/interactive/main-world.js), [gui-service.js](Project/interactive/gui-service.js), [settings](Project/interactive/main-world-setting.js) และ [EduSDK](Project/interactive/eduSdk.js)
7. สร้างไฟล์จริงและทำตาม [TESTING.md](TESTING.md); ใช้ [ERROR_CASES](contracts/ERROR_CASES.md) ช่วยซ่อม

หากอ่านผ่านเว็บไม่ครบ ให้ clone repository จาก ข้อความ START_PROMPT ที่ผู้มอบหมายส่งมาแยกต่างหาก หรือใช้ ZIP ที่ได้รับ ไม่ต้องอ่านบทเรียนทุกบททุกครั้ง ห้ามอ้างว่าอ่านหรือทดลองแล้วถ้ายังไม่ได้ทำจริง

## โครงสร้างภายใน repository นี้

```text
<repository-root>/
├── README.md
├── MASTER_README.md
├── EXAMPLES.md
├── examples.json             ← path อ้างจาก root นี้
├── TESTING.md
├── SOURCE_MANIFEST.json      ← ที่มาและ SHA-256 ของ source snapshot
├── LESSON_OUTPUT_TEMPLATE.html
├── sdk/                      ← API, GUI, types, capabilities, catalog
├── contracts/                ← contract, schema, repair guide
├── validator/                ← static validator ใช้ Node built-in
└── Project/interactive/
    ├── eduSdk.js
    ├── main-world.html
    ├── main-world.js
    ├── gui-service.js
    ├── main-world-setting.js
    ├── runtime-setting-menu.js
    ├── world.css
    ├── chapters/             ← ตัวอย่าง HTML ทั้งหมด
    └── assets/library/
        ├── README.md
        └── catalog.json      ← ข้อมูล Asset ID ไม่ใช่ไฟล์โมเดล
```

ในเครื่องเจ้าของ root นี้อยู่ที่ `AI/Github/git` แต่เมื่อ sync ขึ้น GitHub ให้เปิด README ที่ root ได้เลย ลิงก์ในเอกสารไม่พึ่ง path ภายนอก repository และคงตัวพิมพ์ `Project/interactive` ให้ตรงกัน

## รูปแบบและขอบเขตงาน

ค่าเริ่มต้นคือ lesson-only: ส่ง HTML หนึ่งไฟล์ ใช้ primitive/group/text และ Standard Asset ID ตาม catalog ที่มีจริง ไม่แก้ source snapshot, settings, CSS, SDK หรือเพิ่ม asset โดยปริยาย source ที่เห็นมีไว้ตรวจ API และโครงสร้าง

Host เรียก EduSDK → ตรวจ `script[data-lesson-app]` → เปิด main-world → เรียก PuzzleLesson.define และ lifecycle → บทเรียนสร้างฉากผ่าน context ส่วน runtime ดูแล renderer, GUI, กล้อง, Lab, Quiz และการปิด บทเรียนจึงไม่สร้าง renderer, canvas หรือแผง UI กลางซ้ำ

GUI ที่ใช้ได้มี question, console, topMessage, choice, gizmo, feedback, dialog, insight, control, hint และ busy พร้อมตัวอย่างใน GUI Service Reference; Callout, World Counter, World GUI, Target Focus และ Guideline ดูใน Public API

คำขอผู้ใช้กำหนดงาน → Master กำหนดกฎ → source snapshot ยืนยัน implementation → SDK/contract อธิบายการใช้งาน → ตัวอย่างแสดง pattern หากไม่ตรงกันให้ตรวจ public API ใน source และรายงานความต่าง ไม่เข้าถึง internal API เพียงเพราะค้นพบ

TEACHER_EXTERNAL ใน contract/validator หมายถึงข้อจำกัด portable lesson-only หากผู้ใช้มอบหมายงานระบบเพิ่มเติมโดยชัดเจน ให้รายงาน patch แยกสำหรับระบบปลายทาง; source repo นี้ยังไม่ใช่ชุด deploy ใช้รูปแบบส่งมอบด้านล่างให้ตรงกันทั้งงานสร้างและงานซ่อม

## การอัปเดตและผลทดสอบ

Source คัดจาก working tree ของโปรเจกต์หลัก ไม่รับรองว่าเท่ากับ upstream commit ที่สะอาดทุกไฟล์ ดู hash รายไฟล์ใน SOURCE_MANIFEST.json เมื่อต้นทางเปลี่ยน ต้องคัด source และ sync SDK, catalog, types, Master, template, validator และดัชนีตัวอย่างพร้อมกัน

catalog สองตำแหน่งมีเนื้อหาเดียวกัน: ใต้ Project ใช้อ่านคู่ runtime ส่วน sdk ใช้กับ validator และ portable API โดยไม่ต้องแนบ asset binary เส้นทาง asset/import ใน source คงตามระบบจริงและอาจไม่มีไฟล์ปลายทางในชุดอ่านนี้โดยตั้งใจ

ส่ง HTML พร้อมผล static, ขอบเขตคำตอบ, commit ของ repository อ้างอิง และรายการ runtime checks ที่ยังรอระบบปลายทาง การผ่าน validator ไม่เท่ากับผ่าน browser หรือเนื้อหาการสอน ไม่ต้องทำให้ repository นี้เปิดเว็บได้ก่อนส่งงาน


## โครงสร้างสำหรับผู้มอบหมายและการ sync

ในโปรเจกต์เจ้าของมีเพียง:

```text
AI/Github/
├── START_PROMPT.txt ← ไฟล์ข้อความ ใช้ส่งโจทย์ ไม่อยู่ใน public repo
└── git/          ← Git repository ที่ sync; README นี้อยู่ที่ root ของ repo
```

ผู้มอบหมายเติม [REPO] และเนื้อหาใน START_PROMPT.txt แล้วส่งข้อความให้ทีมแยกต่างหาก AI ภายนอกจึงไม่ต้องค้นไฟล์ prompt ใน repository นี้ ให้ใช้โจทย์ที่ได้รับมาเป็นข้อมูลเนื้อหา ส่วนกฎการสร้างอยู่ใน Master และ SDK เมื่ออ่านเว็บไม่ได้ให้ใช้ clone หรือ ZIP ของ repository นี้

## CREATE — สร้างบทเรียนใหม่

แปลงโจทย์เป็นผลการเรียนรู้, ค่าที่ครูปรับได้, ขั้น Lab ที่มีความหมาย, state/การเปลี่ยน state ที่ยอมรับและปฏิเสธ, คลัง Quiz พร้อม predicate ที่ยอมรับทุกคำตอบที่ถูก, cleanup และการจัดฉากแนวตั้ง ก่อนลงมือเลือก GUI Service และ Asset ID จริง ผลลัพธ์เป็น HTML หนึ่งไฟล์ ไม่ใช่แผนหรือ API ที่สมมติขึ้น

## REPAIR — ซ่อมบทเรียนจากรายงาน

รับไฟล์ HTML เดิมพร้อม code, stage, message, ขั้นตอนทำซ้ำ และผลที่คาดหวัง ตรวจ [ERROR_CASES](contracts/ERROR_CASES.md) แล้วซ่อมเฉพาะ logic ของบทเรียนเท่าที่จำเป็น รักษาเนื้อหาและพฤติกรรมที่ไม่เกี่ยวข้อง ไม่แก้ runtime เพื่อกลบปัญหาของบทเรียน ตรวจซ้ำและคืน **HTML ฉบับเต็ม** เพื่อให้แทนไฟล์เดิมได้ ไม่ส่งเพียง diff หรือ fragment

หากเป็นข้อจำกัดของระบบกลางจริง ให้รายงาน capability ที่ขาดและทำส่วนอื่นต่อ ไม่เพิ่ม asset, API สมมติ หรือ UI ที่ซ้ำกับระบบกลาง

## Self-review และรูปแบบส่งมอบ

ก่อนส่ง ตรวจ HTML/JS ครบ, script และ define อย่างละหนึ่ง, lifecycle ครบ, API ทุกตัวตรง reference/source, keys ของ Teacher Tools ตรงกัน, sequence/freestyle ถูกต้อง, Quiz ไม่ตอบระหว่าง reset และไม่เฉลย, ไปต่อได้หลังลงมือทั้งถูกและผิด, ทุกคำตอบที่ถูกตามกติกาถูกยอมรับ, slot ไม่ทับกัน, ลากออกเพื่อแก้ได้ และล้าง timer/state/GUI scope ครบ

รัน validator และแก้ error ที่รายงานทุกข้อ หากรันเครื่องมือไม่ได้ให้รายงานว่าเป็น self-review เท่านั้น ไม่อ้างว่า validator ผ่าน ส่วน browser/mobile checks ทำเมื่อมีระบบปลายทางตาม TESTING.md

- เครื่องมือเขียนไฟล์ได้: ส่ง HTML จริงหนึ่งไฟล์ พร้อมรายงานสั้นแยกจากโค้ด ระบุ commit ที่อ้างอิง ผล static และผล runtime ที่ทำจริงหรือยังไม่ได้ทำ
- Chat ที่เขียนไฟล์ไม่ได้: ส่งชื่อไฟล์และ HTML ครบหนึ่ง code block จากนั้นรายงานสั้นนอก code block
- ใช้รูปแบบเดียวกันทั้ง CREATE และ REPAIR; ไม่ส่ง runtime patch หรือ asset เพิ่มสำหรับงาน lesson-only

เมื่อระบบเปลี่ยน ให้ sync source snapshot, Public API, GUI catalog, types, capabilities, asset catalog, contract, template, validator และ examples ในรุ่นเดียวกัน ตรวจลิงก์, template และตัวอย่างหลักก่อน sync

