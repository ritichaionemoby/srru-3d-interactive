# คู่มือเผยแพร่ AgentLesson บน GitHub

## แนะนำให้เผยแพร่อะไร

สร้าง Public Repository แยกสำหรับชุด AgentLesson แล้วอัปทุกไฟล์ภายในโฟลเดอร์นี้:

```text
AgentLesson/
├─ README.md
├─ MASTER_README.md
├─ HUMAN_GUIDE.md
├─ START_PROMPT.txt
├─ GITHUB_UPLOAD_GUIDE.md
├─ CHANGELOG.md
├─ LESSON_OUTPUT_TEMPLATE.html
├─ lesson0.html
├─ contracts/
│  ├─ LESSON_CONTRACT.md
│  ├─ ERROR_CASES.md
│  └─ lesson.schema.json
├─ sdk/
│  ├─ LESSON_API_REFERENCE.md
│  └─ lesson-sdk.d.ts
└─ validator/
   ├─ README.md
   └─ validate-lesson.mjs
```

ไม่ควรอัป source ภายในทั้งหมดของ `main-world.js`, CMS, secret, deployment config, `node_modules` หรือ assets ขนาดใหญ่ เพราะ Agent ต้องรู้เฉพาะ public contract ไม่ควรอาศัย internal implementation

## ตั้งค่า repository ครั้งแรก

1. ให้ `README.md` เป็นหน้าแรกและ System Instructions สำหรับ AI; ใช้ `HUMAN_GUIDE.md` เป็นคู่มือสำหรับคน
2. ใช้ branch หลักที่เข้าถึงผ่าน URL สาธารณะได้
3. นำ URL repository ไปใส่ใน `START_PROMPT.txt` ก่อนแจกให้คุณครู
4. แนะนำให้สร้าง release/tag ตาม Contract version เช่น `v1.0.0`
5. เมื่อ SDK เปลี่ยน ให้แก้ reference, type, template, validator และ changelog ใน commit เดียวกัน

## ไฟล์ที่ส่งให้คุณครู

ส่งให้อาจารย์เพียง `START_PROMPT.txt` โดยภายในชี้มายัง Public GitHub Repository นี้ หาก AI เปิด URL ไม่ได้จริง จึงค่อยส่ง zip ของ repository ทั้งหมด

คุณครูแก้เฉพาะส่วน `เนื้อหาที่อาจารย์กรอก` ใน START_PROMPT ไม่ต้องอ่านหรือแก้ README, Master หรือเอกสารเทคนิค

## Checklist ก่อนปล่อยเวอร์ชัน

- [ ] `lesson0.html` ตรงกับ canonical lesson ที่ทดสอบใน runtime
- [ ] `MASTER_README.md` สอดคล้องกับกฎกลางในโปรเจ็คและมี Distribution Mode สำหรับ Public Repository
- [ ] `LESSON_OUTPUT_TEMPLATE.html` ผ่าน validator
- [ ] `lesson0.html` ผ่าน validator
- [ ] Public API reference ตรงกับ runtime เวอร์ชันปัจจุบัน
- [ ] ไม่มี internal/private API ในตัวอย่าง
- [ ] ไม่มี path หรือข้อมูลลับจาก deployment
- [ ] ลิงก์ relative ใน README เปิดได้จาก GitHub
- [ ] อัปเดต CHANGELOG และ Contract version แล้ว
