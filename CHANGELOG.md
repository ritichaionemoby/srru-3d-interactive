# Changelog

## 2026-09-07 — รวมชุดสร้างบทเรียนภายนอกเป็น Github

- รวมคู่มือ, Master, SDK, GUI examples, contract/schema, types, template, validator และ source snapshot ไว้ที่ root ของ repo
- ย้าย START_PROMPT ไปเป็นไฟล์ข้อความนอก repo ที่ผู้มอบหมายส่งแยก ไม่เผยแพร่พร้อม source
- รวม workflow CREATE/REPAIR, self-review, error-report และการคืน HTML ฉบับเต็มจากชุด authoring เดิม
- ใช้ README เป็นจุดเริ่มเดียว รวมวิธีมอบหมายและ sync จึงลบคู่มือคน/คู่มืออัปโหลดที่ซ้ำกัน
- ลบชุด authoring เดิมจากโปรเจกต์เจ้าของและปรับเอกสารภายในให้ชี้มาชุด Github
- เก็บ source สำหรับอ่านและ static checks ไม่รวม plugin หรือ asset binary; runtime test ใช้ระบบปลายทาง

Source snapshot ระบุที่มาและ hash ใน SOURCE_MANIFEST.json
