# Changelog

## 2026-08-21 — Access profiles

- แยก `TEACHER_EXTERNAL` ออกจาก `DEV_WORKSPACE` ชัดเจน
- อาจารย์ภายนอกสร้างได้หนึ่ง lesson HTML และใช้เฉพาะ primitive/Standard Asset Library
- custom asset และ `world.addModel()` เป็น Dev-only พร้อมเพิ่ม validator profile

## 1.0.0 — 2026-08-21

- สร้าง provider-neutral AgentLesson authoring kit
- เพิ่ม lesson contract และ Public SDK reference
- เพิ่ม `LESSON_OUTPUT_TEMPLATE.html` และ canonical `lesson0.html`
- เพิ่ม static validator และ error catalog สำหรับส่งกลับให้ AI ซ่อม
- เพิ่ม START_PROMPT สำหรับคุณครูและทีม Admin
- เพิ่ม `MASTER_README.md` จากกฎกลางของระบบ พร้อม Public Repository Distribution Mode
- เปลี่ยน `README.md` เป็น System Instructions สำหรับ AI และแยกคู่มือคนไป `HUMAN_GUIDE.md`
- ปรับ `START_PROMPT.txt` ตามโครงแบบฟอร์ม `Project/interactive/ExampleGen.md` โดยแยกข้อมูลบทเรียน ฉาก เงื่อนไข Lab ตัวช่วยสอน Quiz Teacher Tools ค่าเริ่มต้น และแนวทางภาพ
- เพิ่ม Universal Scene SDK 2.0, Standard Asset Library, primitive/group/text/custom-model APIs และ drag/click interaction โดยคง API ของ Lesson 0
