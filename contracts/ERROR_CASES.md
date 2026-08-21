# Error Cases และแนวทางส่งกลับให้ AI ซ่อม

เมื่อ runtime หรือ validator แจ้ง error ให้นำ error code, stage, message และชื่อไฟล์ส่งกลับให้ AI พร้อมคำสั่งว่าให้ซ่อมเฉพาะ lesson file

| Code | Stage | ความหมาย | แนวทางตรวจ |
|---|---|---|---|
| `LESSON_FETCH_FAILED` | fetch | โหลดไฟล์ไม่ได้, path/HTTP status ผิด | ตรวจ URL, relative path, same origin |
| `LESSON_HTML_INVALID` | parse | HTML shell ไม่สมบูรณ์ | เทียบกับ output template |
| `LESSON_APP_SCRIPT_MISSING` | parse | ไม่พบ `script[data-lesson-app]` | เพิ่ม script ตาม template |
| `LESSON_APP_SCRIPT_DUPLICATE` | parse | มี registration script มากกว่าหนึ่ง | เหลือเพียงหนึ่ง script |
| `LESSON_SCRIPT_SYNTAX_ERROR` | compile | JavaScript syntax ผิด | ตรวจวงเล็บ, comma, string และ template literal |
| `LESSON_DEFINE_MISSING` | register | ไม่เรียก `PuzzleLesson.define` | เพิ่ม definition หนึ่งครั้ง |
| `LESSON_DEFINE_DUPLICATE` | register | register มากกว่าหนึ่ง lesson | เหลือ define ครั้งเดียว |
| `LESSON_META_INVALID` | validate | meta หรือค่าบังคับไม่ครบ | ตรวจ id, lessonId, worldType, arrays |
| `LESSON_LIFECYCLE_MISSING` | validate | ขาด mount/reset/onStep/dispose | เพิ่ม lifecycle ให้ครบ |
| `LESSON_API_NOT_SUPPORTED` | runtime | เรียก API ที่ไม่มี | ใช้เฉพาะ Public API reference |
| `LESSON_MOUNT_FAILED` | mount | error ระหว่าง mount | ตรวจ context access และ state เริ่มต้น |
| `LESSON_RESET_FAILED` | reset | error ระหว่างสร้างฉาก/คำถาม | ตรวจ values, handles, array และ quiz data |
| `LESSON_STEP_FAILED` | step | error เมื่อเปลี่ยน Lab step | ตรวจ index, step และ handle ที่อาจไม่มี |
| `LESSON_ASSET_NOT_FOUND` | asset | path asset ไม่ถูกต้อง | ใช้ `context.resolveAsset` และ asset ที่มีจริง |
| `LESSON_LOAD_TIMEOUT` | load | lifecycle หรือ asset รอนานเกินกำหนด | เอา network/dependency ออกและตรวจ Promise |
| `SDK_VERSION_MISMATCH` | validate | lesson ต้องการ API คนละเวอร์ชัน | ปรับ lesson ให้ตรง AgentLesson contract ปัจจุบัน |
| `LESSON_RUNTIME_ERROR` | runtime | exception อื่นใน lesson | ใช้ stack/message หา lifecycle และบรรทัดที่ผิด |

## Repair Prompt มาตรฐาน

```text
ซ่อมเฉพาะไฟล์ lesson ที่แนบมา ห้ามแก้ runtime, SDK, settings หรือ CSS
อ่าน README.md, LESSON_CONTRACT.md, LESSON_API_REFERENCE.md,
LESSON_OUTPUT_TEMPLATE.html และ lesson0.html ก่อนซ่อม

Error code: [CODE]
Stage: [STAGE]
File: [FILENAME]
Message: [MESSAGE]
Details: [DETAILS]

คืนเฉพาะชื่อไฟล์และ HTML code block ที่แก้สมบูรณ์แล้วหนึ่ง block
```

ข้อความสำหรับผู้ใช้งาน runtime:

> นำข้อความนี้ส่งต่อให้ผู้พัฒนาบทเรียน หรือส่งเข้า AI Agent เพื่อแก้ไขข้อผิดพลาด

