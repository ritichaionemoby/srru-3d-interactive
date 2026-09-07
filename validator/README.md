# Github Static Validator

Validator นี้ตรวจโครงสร้างและ syntax โดยไม่รัน lesson และไม่โหลด dependency ภายนอก รวมถึงบังคับให้มี `meta.title`, `meta.category` และ `meta.subcategory` ที่ไม่ว่าง

ค่าเริ่มต้นใช้ profile `teacher-external` และจะปฏิเสธ `world.addModel()`, `type: "model"` และ direct asset path ถ้าทีม Dev ตรวจบทเรียนที่ได้รับอนุญาตให้ใช้ custom asset โดยชัดเจน ให้ระบุ `--profile=dev-workspace`

รันจาก repository root และแทน path ตัวอย่างด้วยไฟล์งานจริง:

```bash
node validator/validate-lesson.mjs LESSON_OUTPUT_TEMPLATE.html
node validator/validate-lesson.mjs Project/interactive/chapters/lesson0.html
node validator/validate-lesson.mjs path/to/lesson_1.html
node validator/validate-lesson.mjs path/to/dev_lesson.html --profile=dev-workspace
```

Exit code `0` หมายถึงผ่าน static checks; exit code `1` หมายถึงพบ error และจะแสดง JSON report พร้อม `repairPrompt` สำหรับส่งกลับให้ AI

Static validator ตรวจเพิ่มว่าทุก `this.someHelper()` มี method ที่ประกาศจริงใน lesson definition, ชื่อ `world.*()` ที่เรียกมีใน Public API และห้ามบันทึกคำตอบ Quiz ใน `reset()` หรือ helper ที่ `reset()` เรียก หากพบ helper ที่ไม่มีจะคืน `LESSON_HELPER_MISSING`; หากพบ world API ที่คิดขึ้นเองจะคืน `LESSON_API_NOT_SUPPORTED` ก่อนนำไฟล์เข้า runtime แต่ยังไม่สามารถยืนยัน logic, framing, drag/drop หรือคำตอบ Quiz ได้ทั้งหมด หลังผ่านแล้วต้องทดสอบใน runtime จริงทั้ง Lab, Quiz, desktop และ mobile รวมถึงเส้นทาง “ต่อไป → ส่งคำตอบ → ดูผล → ปิดบทเรียน”



