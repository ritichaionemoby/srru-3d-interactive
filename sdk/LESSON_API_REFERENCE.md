# Lesson Public API Reference

เอกสารนี้คือ allow-list: บทเรียนเรียกได้เฉพาะ API ที่ระบุไว้ หากต้องการ feature อื่นต้องเพิ่มใน runtime และอัปเดต contract ก่อน ห้าม AI สมมติชื่อ method เอง

> **TEACHER_EXTERNAL restriction:** ใช้เฉพาะ primitive/group/text และ Standard Asset Library ชุดนี้ไม่เปิด custom-model API หรือ direct asset path ให้บทเรียนภายนอก

ดู type signatures เพิ่มเติมที่ [`lesson-sdk.d.ts`](lesson-sdk.d.ts)

## Universal Scene API (SDK 2.1)

บทเรียนใหม่ไม่ควรคัดลอกฉากซ้าย/ขวา กล่อง หรือเครื่องหมายจาก Lesson 0 โดยอัตโนมัติ ให้เลือกวัตถุและการจัดฉากตามเนื้อหาของครูผ่าน API กลางต่อไปนี้ ส่วน API เดิมยังรองรับเพื่อให้บทเรียนเก่าทำงานต่อได้

### Standard Asset Library

รายการที่ runtime ใช้จริงอยู่ที่ `Project/interactive/assets/library/catalog.json` และมี portable snapshot สำหรับ AI ที่ `sdk/asset-library.catalog.json`

```js
const apple = world.addLibraryObject({
  asset: "food/apple",
  name: "answer-apple",
  position: [-3, 0.2, 0],
  scale: 1.1,
  draggable: true,
  onDrop(position, handle) {
    return { accepted: true, commit: true };
  }
});
```

Asset เริ่มต้น:

- `food/apple`
- `food/pizza`
- `sports/ball`
- `science/water-tank`
- `math/balance-scale`
- `space/rocket`
- `classroom/counter`

ตรวจรายการแบบ runtime ได้ด้วย `context.assets.list()` และ `context.assets.get(id)` ห้ามสมมติ Asset ID ที่ไม่มีใน catalog

### `world.addPrimitive(options)`

สร้างรูปร่างมาตรฐาน รองรับ `box`, `sphere`, `cylinder`, `cone`, `torus`, `circle` และ `plane`

```js
world.addPrimitive({
  shape: "cylinder",
  size: [2, 0.5, 2],
  position: [0, 0.25, 0],
  color: "#ffcf62",
  draggable: true
});
```

### `world.addGroup(options)`

ประกอบหลาย primitive เป็นวัตถุเดียว ทุก `parts` ใช้ position/rotation แบบ local ภายใน group:

```js
world.addGroup({
  name: "simple-rocket",
  position: [0, 0, 0],
  parts: [
    { shape: "cylinder", size: [1, 2.5, 1], position: [0, 1.4, 0], color: "#ffffff" },
    { shape: "cone", size: [1.1, 1.2, 1.1], position: [0, 3.2, 0], color: "#ff7897" }
  ]
});
```

ถ้าวัตถุคลิกได้แต่บทเรียนมีเอฟเฟกต์ Active ของตัวเอง ให้กำหนด `selectionFeedback: false` เพื่อไม่แสดงวง Hover และลูกศร Select ของระบบกลาง

### `world.addConnector(options)`

สร้างเส้นเชื่อมจากตำแหน่งหนึ่งไปยังอีกตำแหน่งหนึ่ง ระบบคำนวณองศา 3 มิติให้โดยตรง เหมาะกับกราฟ กิ่งไม้ และความสัมพันธ์ระหว่างวัตถุ

```js
world.addConnector({
  from: [0, 1, 0],
  to: [4, .5, 2],
  color: "#ffad38",
  thickness: .08,
  opacity: .75
});
```

วัตถุ interactive แบบ primitive, group และ library ใช้ Highlight กลางของระบบโดยอัตโนมัติ: Material Tint ทั้งวัตถุ วงแหวนที่คำนวณจาก Bounding Box รวม และ Marker รูปเพชรลอยเมื่อเลือก จึงรองรับวัตถุประกอบหลายชิ้นโดยไม่มีเส้น Outline ซ้อน บทเรียนไม่ต้องสร้าง Highlight เอง

### `world.addText3D(options)`

สร้างข้อความสั้นใน world space สำหรับ label บนวัตถุเท่านั้น ข้อความจะหันเข้าหากล้องและไม่ใช่ polygon จึงห้ามใช้เป็นป้ายโจทย์หลักหรือเครื่องหมายคำนวณบนฐาน

```js
world.addText3D({
  text: "คำตอบ",
  position: [0, 1.2, 0],
  size: [2.2, 1.7],
  color: "#6049c7",
  background: "rgba(255,255,255,.8)"
});
```

เครื่องหมายเปรียบเทียบและคำนวณ `= ≠ < > ≤ ≥ + - × ÷` ให้ใช้ `world.addOperatorSign()` เพื่อให้ได้ polygon 3D และฐานมาตรฐานเดียวกันทุกบท

### Custom model

ไม่มีใน TEACHER_EXTERNAL allow-list ห้ามใช้ `world.addModel()`, `type: "model"`, `context.resolveAsset()` หรือ path ไปยัง GLB/GLTF/FBX ถ้าต้องการโมเดลใหม่ ให้ส่ง requirement ให้ทีม Dev เพิ่มเป็น Standard Asset ID แล้วอัปเดต catalog ก่อน

### `world.addObject(options)`

Dispatcher กลางรองรับ `type: "primitive" | "group" | "text3d" | "library"`; runtime มี `type: "model"` สำหรับ DEV_WORKSPACE แต่ TEACHER_EXTERNAL ห้ามใช้

### Interaction กลาง

วัตถุจาก API ใหม่กำหนดได้ทั้ง:

- `draggable`, `dragAxis`, `guideTarget`, `onDrag`, `onDrop`
- `clickable`, `onClick({ handle, object, hitPoint })`

การ drag และ click จะเรียก objective action, Highlight/Selection และ system SFX ผ่าน main-world อัตโนมัติ บทเรียนควรกำหนดเฉพาะ state/condition ของตนเอง

หาก `onDrop(position, handle)` เรียก `handle.setPosition(...)` หรือ `handle.animateTo(...)` เพื่อ snap วัตถุเข้า grid Runtime จะรักษาตำแหน่ง/แอนิเมชันนั้นไว้และไม่ใส่ drop bounce ทับอีกครั้ง หาก callback ไม่จัดตำแหน่งเอง Runtime จึงใช้ drop bounce มาตรฐาน

## Context

`mount(context)` ได้ object แบบ read-only:

- `context.world` — สร้างและควบคุม object ใน world space
- `context.ui` — GUI Service กลาง ได้แก่ Question, Console, Top Message, Choice, Gizmo, Feedback, Dialog, Insight Dialog, Control, Hint และ Busy รวม compatibility objective/toast/progress
- `context.audio.play(name)` — เล่น SFX ที่ระบบเตรียมไว้
- `context.mode` — `teacher-lab`, `student-lab` หรือ `student-quiz`
- `context.language` — ภาษาจากเว็บหลัก
- `context.lessonData` — ข้อมูลบทเรียนที่ Runtime resolve แล้ว: โดยปกติใช้ `title`/`name`, `category`, `subcategory` ที่เว็บหลักส่งมาเมื่อไม่ว่าง แล้ว fallback จาก lesson meta; หาก `mainWorldSetting.overrideTitleName` เป็น `true` จะใช้ `meta.title`, `meta.category`, `meta.subcategory` ก่อนเสมอ
- `context.objectiveAction()` — แจ้ง attempt ที่ตั้งใจให้ผู้เรียนไปต่อได้ แต่ยังไม่เปลี่ยน state คำตอบ เช่น invalid drop หรือการกดข้าม; ไม่ต้องเรียกซ้ำหลัง `quiz.answer`
- `context.quiz.answer(correct, details)` — อัปเดตคำตอบ Quiz ล่าสุดและเปิดปุ่มไปต่ออัตโนมัติหลังข้อพร้อมใช้งาน; ห้ามเรียกจาก `reset()` และคำสั่งระหว่างเตรียมข้อจะถูก Runtime ปฏิเสธ
- `context.complete(result)` — จบบทเรียนและส่ง result กลับ host
- `context.root` — root ที่ runtime จัดให้; World lesson ไม่ควรสร้าง UI กลางลงไป

## World

### `world.addBox(options)`

สร้างกล่อง 3D และคืน `LessonHandle`

```js
const box = world.addBox({
  name: "answer-0",
  size: [1.4, 1.4, 1.4],
  position: [-4, 0.85, 2.4],
  color: "#75b9ee",
  draggable: true,
  dragAxis: "xz",
  hoverMessage: "ลากกล่องไปยังพื้นที่คำตอบ",
  guideTarget: [4, 0.4, -1],
  onDrag(position) {},
  onDrop(position, handle) {
    return { accepted: true, commit: true };
  }
});
```

`dragAxis` ใช้ `"xz"` สำหรับพื้น world หรือ `"xy"` สำหรับระนาบหันกล้อง

### `world.addZone(options)`

สร้างพื้นที่ source/target และคืน handle:

```js
world.addZone({
  name: "answer-zone",
  size: [7.4, 0.28, 6.6],
  position: [4.2, 0.15, -1],
  color: "#d8f5df",
  opacity: 0.82
});
```

### `world.addCallout(options)` / `world.addLabel(options)`

สร้างป้าย GUI ที่อ่านตรงและล็อกเข้าหาจอ โดยฉาย `position` จาก World มายังหน้าจอและเชื่อมกับ `anchor` ด้วย leader line/ring ในฉาก ระบบกลางดูแลขนาด Desktop/Mobile และป้องกันป้ายหลุดขอบจอ ใส่ `insight` เมื่อต้องการให้ป้ายเป็นจุดกดเปิดคำอธิบาย ห้ามสร้าง DOM/Sprite ทดแทนภายใน lesson:

```js
world.addCallout({
  text: "ดูวิธีสร้างคำตอบ",
  position: [4.2, 4.35, 0.35],
  compactPosition: [2.5, 3.9, 0.35],
  anchor: [4.2, 0.28, -1],
  color: "#23324d",
  lineColor: "#7857ff",
  scale: [2.85, 0.82],
  compactScale: [2.45, 0.92],
  insight: () => ({
    title: "พื้นที่คำตอบ",
    message: "ลากวัตถุเข้าไปในกรอบนี้",
    primaryLabel: "เข้าใจแล้ว"
  })
});
```

หากไม่มี `insight` หรือ `onClick` ป้ายยังเป็น Callout แสดงผลอย่างเดียวเหมือนเวอร์ชันเดิม Actionable Callout มี icon ข้อมูลและ hover animation อัตโนมัติ โดยค่าเริ่มต้นการเปิดคำอธิบายไม่นับเป็น Quiz objective action

### Interaction hit area สำหรับโมเดลขนาดเล็ก

```js
const carrot = await world.addLibraryObject({
  asset: "food/carrot",
  draggable: true,
  hitArea: [3, 1.1, 2.15],
  hitAreaOffset: [0, 0.78, 0],
  dragFromCenter: true
});

// หลังหยิบออกจากฐาน ให้กลับไปจับตามขนาดโมเดลจริง
carrot.setHitArea(null);
carrot.setDragFromCenter(false);
```

Hit area โปร่งใสและไม่ถูกนำไปคำนวณขนาดวง Highlight จึงช่วยเพิ่มความสะดวกบนมือถือโดยไม่ทำให้โมเดลหรือ selection ใหญ่ผิดปกติ

### `world.addOperatorSign(options)`

รองรับ `=`, `≠`, `<`, `>`, `≤`, `≥`, `+`, `-`, `×` และ `÷` คืน `OperatorHandle` ซึ่งเพิ่ม `setState(valid)` และ `pulse()` ตัวเครื่องหมายเป็น polygon 3D และใช้ฐานมาตรฐานเดียวกันทุกบท (`!=`, `<=`, `>=` ใช้เป็น alias ได้)

### `world.addWorldCounter(options)`

ตัวนับเลขดิจิตอลแบบ 3D ที่วางบนพื้น ใช้เฉพาะแสดงจำนวนและไม่รับ interaction:

```js
const counter = world.addWorldCounter({
  name: "answer-counter",
  position: [4.2, 0.2, 2.8],
  compactPosition: [3.2, 0.2, 3.4],
  value: 0,
  digits: 2
});

counter.setValue(12);
counter.getValue();
```

รองรับเลขจำนวนเต็มตั้งแต่ `0` ถึงจำนวนหลักที่กำหนด (`digits` 1–6) และ `leadingZero: true` เมื่อต้องการแสดงศูนย์นำหน้า ห้ามใช้แสดงข้อความหรือทำเป็นปุ่ม

### `world.addWorldGui(options)`

กรอบข้อความแบบ 3D ที่วางราบบนพื้น ใช้อธิบายบริเวณโดยไม่บังหน้าจอและไม่รับ interaction:

```js
const instruction = world.addWorldGui({
  name: "drag-instruction",
  text: "ลากแครอทไปวางในช่องคำตอบ",
  position: [0, 0.24, 5.8],
  compactPosition: [0, 0.24, 5.2],
  size: [5.2, 1.65],
  maxLines: 3
});

instruction.setText("ลากวัตถุชิ้นต่อไปมาวางที่นี่");
instruction.getText();
```

ใช้ `compactPosition`/`compactScale` เมื่อต้องจัดตำแหน่งเฉพาะมือถือ ปรับเฉพาะงานจำเป็นด้วย `textColor`, `backgroundColor`, `borderColor`, `accentColor`, `fontSize` และ `size`; รูปลักษณ์หลักควรใช้ค่ากลางจาก Runtime Setting

### `world.addTargetFocus(options)`

สร้างวง focus animation สำหรับ sequence step:

```js
world.addTargetFocus({
  position: [4.2, 0.34, -0.8],
  radius: 2.05,
  color: "#7857ff"
});
```

ค่า `opacity` ใช้ลดความเด่นของวง และกำหนด `animate: false` เมื่อต้องการวงเส้นประนิ่งที่ใช้เป็นสเกลหรือขอบเขตอ้างอิงแทนวง Focus โดยตำแหน่งจะไม่หมุนหรือ pulse จนคลาดจากวัตถุ นอกจากนี้ปรับ motion รายวงได้ด้วย `rotateSpeed`, `pulseScale` และ `opacityPulse`

### `world.addGuideline(options)`

สร้างเส้นประพร้อมหัวลูกศร:

```js
world.addGuideline({
  fromObject: box.object3D,
  to: [4.2, 0.35, -0.8],
  color: "#6049c7"
});
```

ใช้ `object3D` เพื่อส่งเป็น `fromObject` เท่านั้น ห้ามแก้ material/geometry/internal userData โดยตรง

### Cue และ entrance

- `world.showDragCue(handle, to)` — แสดงมือสาธิตลาก
- `world.hideDragCue()` — ซ่อน cue และต้องเรียกตอนเปลี่ยน step/dispose
- `world.playEntrance()` — เล่น spawn animation ของ scene
- `world.camera.reset()` — reset camera
- `world.camera.configure(options)` — เปลี่ยน camera config (ปกติใช้ `meta.camera`)
- `world.getObject(name)` — ค้น object ด้วยชื่อ; ใช้ handle ที่เก็บไว้จะปลอดภัยกว่า
- `world.clear()` — ล้าง lesson world; runtime จัดการให้ก่อน reset อยู่แล้ว

## Handle

Handle ที่ `add...` คืนมามี:

- `setPosition(x, y, z)` — snap และกำหนด ground Y ใหม่
- `setRotation(x, y, z)` — กำหนดมุมเป็นองศา
- `setScale(x, y?, z?)`
- `animateTo(x, y, z, { duration, delay, arcHeight })`
- `stopAnimation()`
- `playCommit()`
- `setColor(color)`
- `setVisible(value)`
- `setDraggable(value)`
- `setClickable(value)`
- `remove()`
- `object3D` — opaque reference สำหรับ guideline; หลีกเลี่ยงการแก้ internals

## UI

อ่านรายละเอียดและตัวอย่างครบที่ [`GUI_SERVICE_REFERENCE.md`](GUI_SERVICE_REFERENCE.md)

บทเรียนใหม่ใช้ GUI กลางผ่าน:

- `context.ui.question` — โจทย์หลักด้านบน
- `context.ui.console` — Objective, คำอธิบาย และ feedback ใน Console
- `context.ui.topMessage` — ประกาศสั้นด้านบนที่ไม่ใช่โจทย์
- `context.ui.choice` — ตัวเลือกที่กดได้เหนือ Console
- `context.ui.gizmo` — GUI 2D ที่ติดตาม object หรือพิกัด World
- `context.ui.feedback` — ผลลัพธ์สั้นแบบไม่บล็อก
- `context.ui.dialog` — Popup แบบบล็อกสำหรับข้อความสำคัญ/การยืนยัน
- `context.ui.insight` — Popup อธิบายพื้นที่หรือวัตถุที่ผู้เรียนกด รองรับ safe structured HTML
- `context.ui.control` — เมนูปุ่ม utility มุมขวาบน/กลาง/ล่าง ไม่ใช่คำตอบ
- `context.ui.hint` — คำแนะนำผ่าน Mascot กลาง
- `context.ui.busy` — Overlay ระหว่างรอ async task

`context.ui.gizmo` ไม่ใช่ `world.addCallout()`: Gizmo ใช้กับ object/value/status แบบ Screen-space ส่วน Callout ใช้ป้ายและเส้นชี้พื้นที่ในฉาก

```js
context.ui.question.show({ text: "4 + 2 = ?" });
context.ui.console.setObjective("เป้าหมาย: หาผลรวมให้ถูกต้อง");

context.ui.choice.show({
  scope: "question",
  title: "เลือกคำตอบ",
  items: [4, 6, 8],
  onSelect(event) {
    context.quiz.answer(Number(event.value) === 6, { answer: Number(event.value) });
  }
});

context.ui.gizmo.attach(box, {
  scope: "scene",
  type: "label",
  text: "ลากกล่องนี้",
  worldOffset: [0, 1.2, 0]
});
```

Gizmo รองรับ `size: "large"` และ `segments: [{ text, color, role }]` สำหรับป้ายหลายสี โดยใช้ `role: "exponent"` เมื่อต้องแสดงเลขชี้กำลัง

Choice เรียก objective action ให้อัตโนมัติ ระบบล้าง UI ตาม `scope` (`lesson`, `scene`, `step`, `question`, `manual`) และจัด mobile layout ให้ จึงห้ามสร้าง GUI ที่ระบบกลางรองรับด้วย HTML/CSS เอง ดู signature และตัวอย่างทั้งหมดใน `GUI_SERVICE_REFERENCE.md`

### Compatibility API

```js
context.ui.setObjective("เป้าหมาย: ลากกล่องไปยังพื้นที่คำตอบ");
context.ui.setQuestion("4 + 2 = ?");
context.ui.toast("ทำได้ถูกต้อง!", "success");
context.ui.setProgress(2, 4);
```

- `setQuestion(text)` แสดงโจทย์ด้วย UI มาตรฐานด้านบนของฉาก เป็น screen-space จึงไม่หมุนตามกล้อง บทเรียนส่งเฉพาะข้อความ
- `clearQuestion()` ซ่อน UI โจทย์ ปกติ runtime จะล้างให้อัตโนมัติก่อน reset/close
- `setObjective(text)` แสดงเป้าหมายใน Main Console ด้านล่าง
- `toast(text, type)` อัปเดตข้อความสถานะภายใน Main Console และค้างไว้จนกว่าจะมีสถานะใหม่หรือเปลี่ยน Step รองรับ `success`, `warning`, `error`, `info`; ห้ามสร้าง panel ชั่วคราวเอง

ห้ามใช้ `addText3D`, callout หรือ group มาสร้างป้ายโจทย์หลักซ้ำบน world-space หากเนื้อหาต้องอ่านคงที่ ให้ใช้ `setQuestion()`

ใน Quiz ห้าม toast บอกถูก/ผิดระหว่างทำ

## Audio

```js
context.audio.play("success");
```

ชื่อมาตรฐานที่ runtime ปัจจุบันรองรับ: `onClick`, `onDrag`, `onDrop`, `onUiBtnClick`, `success`, `fail`, `nextQuest`, `startLesson`, `completeLesson`

การลากและวางมี system SFX อยู่แล้ว อย่าเรียกเสียงซ้ำทุก pointer move

## Quiz และ Complete

```js
context.quiz.answer(correct, {
  leftCount,
  rightCount,
  operator
});

context.complete({ score: 1, total: 1 });
```

`details` ต้องเป็นข้อมูล plain object ที่ serialize ได้ และควรเพียงพอให้ host แสดงเฉลยภายหลัง

ทุกการเรียก `context.quiz.answer(...)` ที่ Runtime รับได้ถือว่าเป็นการตอบแล้ว ปุ่มของระบบต้องเปลี่ยนเป็น “ต่อไป” และในข้อสุดท้ายเป็น “ส่งคำตอบ” โดยไม่ขึ้นกับค่า `correct` บทเรียนห้ามสร้างปุ่มเหล่านี้เองหรือบังคับให้ตอบถูกก่อน



