# Lesson Public API Reference

เอกสารนี้คือ allow-list: บทเรียนเรียกได้เฉพาะ API ที่ระบุไว้ หากต้องการ feature อื่นต้องเพิ่มใน runtime และอัปเดต contract ก่อน ห้าม AI สมมติชื่อ method เอง

ดู type signatures เพิ่มเติมที่ [`lesson-sdk.d.ts`](lesson-sdk.d.ts)

## Context

`mount(context)` ได้ object แบบ read-only:

- `context.world` — สร้างและควบคุม object ใน world space
- `context.ui` — objective, toast และ progress กลาง
- `context.audio.play(name)` — เล่น SFX ที่ระบบเตรียมไว้
- `context.mode` — `teacher-lab`, `student-lab` หรือ `student-quiz`
- `context.language` — ภาษาจากเว็บหลัก
- `context.lessonData` — metadata ที่เว็บหลักส่งให้ SDK
- `context.resolveAsset(path)` — แปลง relative lesson asset path เป็น URL
- `context.objectiveAction()` — แจ้ง action ครั้งแรกสำหรับ interaction ที่ไม่ใช่ drag
- `context.quiz.answer(correct, details)` — อัปเดตคำตอบ Quiz ล่าสุด
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

สร้างป้าย UI ใน world space พร้อม leader line:

```js
world.addCallout({
  text: "พื้นที่คำตอบ",
  position: [4.2, 4.35, 0.35],
  anchor: [4.2, 0.28, -1],
  color: "#23324d",
  lineColor: "#7857ff",
  scale: [2.85, 0.82]
});
```

### `world.addOperatorSign(options)`

รองรับ `<`, `>` และ `=` คืน `OperatorHandle` ซึ่งเพิ่ม `setState(valid)` และ `pulse()`

### `world.addTargetFocus(options)`

สร้างวง focus animation สำหรับ sequence step:

```js
world.addTargetFocus({
  position: [4.2, 0.34, -0.8],
  radius: 2.05,
  color: "#7857ff",
  secondaryColor: "#62d5ad"
});
```

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
- `animateTo(x, y, z, { duration, delay, arcHeight })`
- `stopAnimation()`
- `playCommit()`
- `setColor(color)`
- `setVisible(value)`
- `setDraggable(value)`
- `remove()`
- `object3D` — opaque reference สำหรับ guideline; หลีกเลี่ยงการแก้ internals

## UI

```js
context.ui.setObjective("เป้าหมาย: ลากกล่องไปยังพื้นที่คำตอบ");
context.ui.toast("ทำได้ถูกต้อง!", "success");
context.ui.setProgress(2, 4);
```

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

