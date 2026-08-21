# Lesson Contract 1.1.0

เอกสารนี้กำหนดรูปแบบบังคับของ `lesson_N.html` สำหรับ World Runtime

สัญญานี้ใช้กับ **TEACHER_EXTERNAL**: ผลลัพธ์เป็น lesson HTML หนึ่งไฟล์ ใช้ได้เฉพาะ primitive/group/text และ Standard Asset ID ที่ประกาศไว้ ห้ามเพิ่ม asset หรือโหลด custom model โดยตรง

## 1. ขอบเขตไฟล์

Lesson Package เป็น HTML UTF-8 ไฟล์เดียวเพื่อความสะดวกในการอัปโหลด แต่ไม่ใช่ standalone webpage ตัว runtime จะอ่านเฉพาะ registration script แล้วส่ง public `context` เข้า `mount(context)`

โครงไฟล์ต้องเป็นดังนี้:

```html
<!doctype html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>ชื่อสำหรับตรวจไฟล์</title>
</head>
<body>
  <script data-lesson-app>
    (() => {
      PuzzleLesson.define({ /* lesson definition */ });
    })();
  </script>
</body>
</html>
```

ข้อบังคับ:

- มี `<script data-lesson-app>` หนึ่งตัว
- เรียก `PuzzleLesson.define(...)` หนึ่งครั้ง
- `body` ไม่มี visual DOM อื่น
- ไม่มี `<style>`, `<link>`, `<script src>`, iframe, canvas หรือ form
- ไม่มี network request, dynamic import, CDN, npm หรือ `THREE` โดยตรง
- ใช้เฉพาะ API ที่ประกาศใน `sdk/LESSON_API_REFERENCE.md`
- ออกแบบฉากจากเนื้อหาของบทเรียน ไม่บังคับใช้โครงซ้าย/ขวาหรือกล่องจาก Lesson 0
- ใช้เฉพาะ Standard Asset ID จาก `sdk/asset-library.catalog.json` ห้าม custom model relative path, `world.addModel()` และ `type: "model"`

## 2. Lesson Definition

```js
PuzzleLesson.define({
  id: "lesson-unique-id",
  version: "1.0.0",
  meta: { /* metadata */ },
  mount(context) {},
  reset({ values, mode, question, questionIndex }) {},
  onStep(index, step) {},
  dispose() {}
});
```

### Lifecycle

- `mount(context)` เรียกหนึ่งครั้งเมื่อโหลด lesson ใช้เก็บ context และตั้ง state ที่ไม่ผูกกับคำถาม
- `reset(payload)` เรียกทุกครั้งที่เริ่ม Lab ใหม่ เปลี่ยนคำถาม Quiz หรือ reset ต้องสร้าง scene/state ใหม่จาก `values`
- `onStep(index, step)` ใช้ใน Lab เพื่อเปลี่ยน sequence/freestyle behavior
- `dispose()` ต้องหยุด timer, cue, animation และล้าง reference เมื่อปิด lesson
- lifecycle อาจเป็น `async` ได้ แต่ error ต้องถูก throw ออกไปให้ runtime รายงาน

Runtime เป็นเจ้าของการ clear world ก่อน reset ดังนั้น lesson ไม่ต้องลบ object ทีละชิ้น แต่ต้องล้าง Map, array, timer และ handle ของรอบก่อน

`reset` สามารถเป็น `async` ได้เมื่อตรรกะบทเรียนจำเป็น แต่ TEACHER_EXTERNAL ห้ามโหลด custom model; Standard Library prefab และ primitive สร้างได้ทันที

## 3. Metadata

ค่าหลักที่ต้องมี:

```js
meta: {
  worldType: "3d-world-space",
  lessonId: "lesson-unique-id",
  description: "คำอธิบายสั้น",
  keyResult: "ผลลัพธ์การเรียนรู้",
  background: "green",
  camera: { /* camera preset */ },
  welcomeMessage: ["ข้อความสั้น"],
  tooltip: "คำแนะนำการควบคุม",
  defaultValue: {},
  editSchema: [],
  howto: [],
  quiz: []
}
```

- `id` และ `meta.lessonId` ต้องตรงกัน
- `worldType` สำหรับบทเรียนนี้ต้องเป็น `3d-world-space`
- key ใน `defaultValue`, `editSchema`, quiz `data` และ logic ใน reset ต้องตรงกัน
- Teacher Tools ทุก field ต้องถูกใช้จริง ห้ามมี control ที่แก้แล้วไม่เกิดผล
- `camera.target` ใช้จัด pivot/framing ของบทเรียน และต้องทดสอบบนจอแนวตั้ง

### editSchema

ชนิดที่ใช้ใน canonical lesson:

```js
{ key: "count", name: "จำนวน", type: "slider", option: [1, 10], step: 1 }
{ key: "side", name: "ฝั่ง", type: "dropdown", option: ["left", "right"] }
{ key: "operator", name: "เครื่องหมาย", type: "dropdown", option: ["<", ">", "="] }
```

### howto

- `index` เริ่ม 0 และเรียงต่อกัน
- `type: "sequence"` เป็นขั้นสังเกต/สาธิต ต้องปิด interactive
- `type: "freestyle"` เป็นขั้นให้ลงมือ ต้องเปิด interactive และคืน scene สู่ state พร้อมเล่น
- แต่ละ step ควรสื่อการเปลี่ยนแปลงด้วย target focus, cue, guideline, pulse หรือ animation ที่สัมพันธ์กับข้อความ

### quiz

```js
quiz: [
  {
    question: "ข้อความโจทย์",
    data: [
      { key: "count", value: 4 },
      { key: "operator", value: "<" }
    ]
  }
]
```

## 4. กฎ Lab และ Quiz

### Lab

- sequence step ปิด draggable/click action
- freestyle step เปิด action หลังสาธิตจบ
- Lab แจ้ง success ได้เมื่อ condition ถูกต้อง
- วาง object ผิดพื้นที่ต้องคืน `{ accepted: false }` หรือ `false` เพื่อให้ runtime เด้งกลับ
- วัตถุที่อยู่ใน target ต้องลากออกเพื่อแก้คำตอบได้

### Quiz

- เริ่มแต่ละข้อด้วย state ใหม่และ interactive ได้ทันที
- การลาก object จะนับ objective action โดย runtime อัตโนมัติ
- action ชนิดอื่นต้องเรียก `context.objectiveAction()` เมื่อผู้เรียนลงมือครั้งแรก
- ทุกครั้งที่ state คำตอบเปลี่ยน ให้เรียก `context.quiz.answer(correct, details)`
- ปุ่มต่อไปต้องเปิดหลัง objective action ครั้งแรก ไม่ขึ้นกับถูกหรือผิด
- ห้ามเฉลยหรือแสดง success/fail ระหว่างกำลังทำ Quiz
- ตรวจ predicate จริง เช่น `< 4` ต้องยอมรับทุกค่าที่น้อยกว่า 4 ไม่ใช่บังคับ sample answer ค่าเดียว
- ถ้ามีหลาย object ให้ใช้ Map/slot allocation เพื่อป้องกันวัตถุซ้อน slot เดียวกัน และคืน slot เมื่อลากออก

## 5. Drag/Drop Result

`onDrop(position, handle)` คืนค่า:

```js
{ accepted: true, commit: true }   // ยอมรับตำแหน่งและเล่น commit feedback
{ accepted: true, commit: false }  // ยอมรับโดยไม่เล่น commit feedback
{ accepted: false }                // runtime นำกลับตำแหน่งก่อนลาก
false                              // เหมือน accepted: false
```

หลังวางที่ยอมรับ ควรเรียก `handle.setPosition(...)` เพื่อ snap ไปยังตำแหน่งที่แน่นอน

## 6. Cleanup

ก่อน reset และใน dispose:

- `clearTimeout` / `clearInterval` ทั้งหมด
- `stopAnimation()` ของ handle ที่กำลัง animate หากจำเป็น
- `context.world.hideDragCue()`
- ล้าง Map, Set, array และ references
- ห้ามเก็บ listener บน `window` หรือ `document`; บทเรียนไม่ควรสร้าง global listener

## 7. Output ของ AI

AI ต้องตอบชื่อไฟล์หนึ่งบรรทัดและ HTML code block หนึ่ง blockเท่านั้น ห้ามส่ง runtime patch, custom asset หรือไฟล์เสริม หาก API/Standard Library ไม่รองรับสิ่งที่ขอ ให้รายงาน capability หรือ Asset ID ที่ต้องให้ทีม Dev เพิ่ม แทนการประดิษฐ์ API/path

ก่อนส่งต้องเปรียบเทียบกับ `LESSON_OUTPUT_TEMPLATE.html`, `lesson0.html` และผ่าน `validator/validate-lesson.mjs`
