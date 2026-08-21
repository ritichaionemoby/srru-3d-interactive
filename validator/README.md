# AgentLesson Static Validator

Validator นี้ตรวจโครงสร้างและ syntax โดยไม่รัน lesson และไม่โหลด dependency ภายนอก

ค่าเริ่มต้นใช้ profile `teacher-external` และจะปฏิเสธ `world.addModel()`, `type: "model"` และ direct asset path ถ้าทีม Dev ตรวจบทเรียนที่ได้รับอนุญาตให้ใช้ custom asset โดยชัดเจน ให้ระบุ `--profile=dev-workspace`

```bash
node validator/validate-lesson.mjs LESSON_OUTPUT_TEMPLATE.html
node validator/validate-lesson.mjs lesson0.html
node validator/validate-lesson.mjs path/to/lesson_1.html
node validator/validate-lesson.mjs path/to/dev_lesson.html --profile=dev-workspace
```

Exit code `0` หมายถึงผ่าน static checks; exit code `1` หมายถึงพบ error และจะแสดง JSON report พร้อม `repairPrompt` สำหรับส่งกลับให้ AI

Static validator ไม่สามารถยืนยัน logic, framing, drag/drop หรือคำตอบ Quiz ได้ทั้งหมด หลังผ่านแล้วต้องทดสอบใน runtime จริงทั้ง Lab, Quiz, desktop และ mobile
