# คู่มือสำหรับคุณครูและทีม Admin

ไฟล์นี้เป็นคู่มือสำหรับคน ส่วน [`README.md`](README.md) และ [`MASTER_README.md`](MASTER_README.md) เป็นคำสั่งสำหรับ AI

## ขอบเขตของอาจารย์

อาจารย์ออกแบบเนื้อหา วิธีเล่น interaction เงื่อนไข Lab/Quiz และ Teacher Tools ได้อย่างอิสระภายใน Public API แต่เพิ่มไฟล์ model, texture, image หรือเสียงเองไม่ได้ ให้ใช้ primitive และ Asset ID ใน Standard Asset Library เท่านั้น ถ้าต้องการของใหม่ ให้แจ้งทีม Dev เพิ่มเข้าคลังกลางก่อน แล้วจึงอัปเดต AgentLesson รุ่นใหม่

## วิธีใช้งานแบบสั้น

1. เผยแพร่ไฟล์ทั้งหมดใน `AI/AgentLesson` เป็น Public GitHub Repository
2. นำ URL repository ไปใส่ใน [`START_PROMPT.txt`](START_PROMPT.txt)
3. ส่งให้คุณครูเฉพาะไฟล์ START_PROMPT
4. คุณครูแก้เฉพาะส่วน `เนื้อหาที่อาจารย์กรอก` แล้วส่งทั้งไฟล์ให้ AI
5. บันทึกคำตอบเป็นไฟล์ `lesson_N.html`
6. ตรวจไฟล์ด้วย validator และทดลองผ่าน runtime จริงก่อนอัปโหลด

```bash
node validator/validate-lesson.mjs lesson_N.html
```

การใช้งานปกติมีเพียง Public Repository และไฟล์ START_PROMPT ที่ส่งให้อาจารย์เท่านั้น หาก AI เปิด GitHub ไม่ได้จริง จึงค่อยแนบ zip ของ AgentLesson ทั้งชุด ห้ามให้ AI เดา contract จาก START_PROMPT

## AI ต้องส่งอะไรกลับมา

AI ต้องส่งชื่อไฟล์และ HTML source สมบูรณ์หนึ่งไฟล์เท่านั้น เช่น:

```text
lesson_1.html
```

ตามด้วย HTML code block หนึ่ง block ไม่ควรได้ runtime patch, CSS, custom asset หรือหลายไฟล์

## หากบทเรียนเปิดไม่ได้

นำ error report จาก runtime หรือ validator พร้อม lesson file ส่งกลับให้ AI โดยใช้แนวทางใน [`contracts/ERROR_CASES.md`](contracts/ERROR_CASES.md) AI ต้องซ่อมเฉพาะ lesson และคืนไฟล์ฉบับเต็ม

## การดูแลเวอร์ชัน

- เมื่อ Public API เปลี่ยน ให้อัปเดต API reference, type definition, Master, template, lesson0, validator และ changelog พร้อมกัน
- ทดสอบ `LESSON_OUTPUT_TEMPLATE.html` และ `lesson0.html` ก่อนปล่อย repository เวอร์ชันใหม่
- รายการไฟล์สำหรับ GitHub และ release checklist อยู่ใน [`GITHUB_UPLOAD_GUIDE.md`](GITHUB_UPLOAD_GUIDE.md)
