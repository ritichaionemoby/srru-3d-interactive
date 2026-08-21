# MASTER README — กฎกลางสำหรับสร้างบทเรียน

> **AgentLesson Distribution Mode — คำสั่งส่วนนี้มีลำดับสูงสุดเมื่ออ่านไฟล์จาก Public Repository**
>
> **Access Profile = TEACHER_EXTERNAL:** สร้างหรือซ่อม lesson HTML หนึ่งไฟล์เท่านั้น แม้ AI จะเห็น workspace เต็มก็ไม่มีสิทธิ์แก้ runtime หรือเพิ่ม asset ใช้ได้เฉพาะ primitive/group/text และ Standard Asset ID ใน `sdk/asset-library.catalog.json` ห้าม `world.addModel()`, `type: "model"`, custom path และไฟล์เสริมทุกชนิด
>
> ชุด `AI/AgentLesson` เป็น snapshot ของ Knowledge + Public SDK สำหรับ AI ภายนอก จึงตั้งใจไม่แนบ internal runtime source ทั้งหมด หากไม่มี `Project/interactive/main-world.js` หรือ workspace เต็ม ให้ใช้ไฟล์ต่อไปนี้แทน source checks ที่กล่าวถึงภายหลัง:
>
> 1. `sdk/LESSON_API_REFERENCE.md`, `sdk/lesson-sdk.d.ts`, `sdk/capabilities.json` และ `sdk/asset-library.catalog.json` — authoritative Public API/Asset snapshot
> 2. `lesson0.html` — canonical implementation จากระบบจริง
> 3. `LESSON_OUTPUT_TEMPLATE.html` — output shell ที่บังคับ
> 4. `contracts/LESSON_CONTRACT.md` — portable contract
> 5. `contracts/ERROR_CASES.md` — repair workflow
>
> การไม่มี internal source ไม่ใช่เหตุให้ปฏิเสธงานหรือสมมติ API เพิ่มเอง ให้สร้าง lesson จาก snapshot ข้างต้น หากทำงานอยู่ในโปรเจ็ค `srru-interactive-3d` ฉบับเต็ม จึงค่อยตรวจ source จริงเพื่อยืนยัน signature แต่กฎ TEACHER_EXTERNAL ยังคงมีอำนาจเหนือ capability แบบ Dev-only ที่พบใน source
>
> Workflow ที่ระบุให้เขียนไฟล์ลง `Project/interactive/chapters/` และทดสอบ browser ใช้เมื่อ AI มีสิทธิ์เข้าถึง workspace เต็มเท่านั้น สำหรับ AI แบบ chat/agent ภายนอก ให้คืน source ของ `lesson_N.html` ตาม Output Protocol ใน `README.md` และทำ static self-review แทน ห้ามแก้ไฟล์ Knowledge/SDK

เอกสารนี้เป็นแหล่งข้อมูลกลางของกระบวนการสร้างบทเรียนด้วย AI สำหรับ Puzzle Widget Platform ภายในโปรเจ็ค `srru-interactive-3d`

เมื่อกฎการสร้างบทเรียน, runtime, UX หรือขั้นตอนตรวจสอบเปลี่ยน ทีม Dev ต้อง sync เอกสารนี้ Public API, types, capabilities, catalog, validator, template และ example ให้ตรงกัน อาจารย์แก้เฉพาะ `START_PROMPT.txt`

## คำสั่งบังคับสำหรับ AI

ก่อนวิเคราะห์ วางแผน สร้าง หรือแก้บทเรียน ต้องอ่านเอกสารนี้ทั้งไฟล์และตรวจ source code ปัจจุบันตามรายการอ้างอิงด้านล่าง ห้ามสร้างจากความจำหรือ pattern ของโปรเจ็คอื่น

AI ต้องลงมือสร้างไฟล์จริง ตรวจโค้ด และทดสอบกับ runtime ไม่ใช่ส่งเพียงตัวอย่างโค้ดหรือคำแนะนำ

## Source of Truth

ตรวจไฟล์จริงใน workspace ตามลำดับนี้ทุกครั้ง:

1. `Project/interactive/chapters/lesson0.html`
   - canonical example ของบทเรียน 3D, lifecycle, Lab, Quiz, Teacher Tools, drag/drop และ cleanup
2. `Project/interactive/main-world.js`
   - public API ปัจจุบันจาก `world`, `makeHandle`, `lessonUi`, `createContext`, `normalizeMeta`, `resetLessonScene` และระบบ Quiz
3. `Project/interactive/main-world-setting.js`
   - background preset, camera, interaction, VFX, mascot และระบบเสียงที่รองรับ
4. `Project/interactive/eduSdk.js`
   - การเปิดบทเรียน, relative path, progress, complete และ close callback
5. หน้า demo ที่โปรเจ็คใช้งานอยู่
   - รูปแบบ `lessonData` และขั้นตอนเปิดบทเรียนรุ่นล่าสุด
6. ไฟล์คำขอของอาจารย์ `START_PROMPT.txt` (ใน DEV_WORKSPACE จึงค่อยใช้ `Project/interactive/ExampleGen.md`)
   - เนื้อหา กิจกรรม และการปรับแต่งเฉพาะบท

source code ใน workspace เวอร์ชันปัจจุบันมีอำนาจเหนือ API หรือรายละเอียดที่ AI เคยจำจากงานก่อนหน้า ห้ามเดาชื่อ method, event, asset หรือ schema ขึ้นเอง

ถ้า `lesson0.html` ใช้ pattern เก่ากว่า runtime ปัจจุบัน ให้ยึด public API ใน runtime และรักษาพฤติกรรมที่ถูกต้องของ Lesson 0 แทนการคัดลอกโค้ดเก่าแบบตรงตัว

## ขอบเขตงานเริ่มต้น

- สร้างหรือแก้เฉพาะไฟล์บทเรียนที่ผู้ใช้ระบุใน `Project/interactive/chapters/`
- ห้ามแก้ `main-world.js`, `main-world-setting.js`, `world.css`, `eduSdk.js`, plugin, catalog หรือ asset กลางทุกกรณีใน TEACHER_EXTERNAL; หากต้องขยายระบบให้รายงานสิ่งที่ขาดเพื่อส่งต่อทีม Dev
- ห้ามแก้ `lesson0.html` เมื่อใช้เป็น reference เว้นแต่ชื่อไฟล์ที่ผู้ใช้สั่งคือ `lesson0.html` หรือผู้ใช้ระบุให้แก้ Lesson 0
- รักษาการเปลี่ยนแปลงเดิมของผู้ใช้และไม่แตะไฟล์ที่ไม่เกี่ยวข้อง
- หากการทำบทเรียนต้องเพิ่มความสามารถใหม่ใน runtime ให้หยุดและอธิบายข้อจำกัดก่อน ห้ามแอบขยาย scope ไปแก้ระบบกลาง

## สัญญาไฟล์บทเรียน

- บทเรียนหนึ่งบทเป็น **Lesson Package HTML** ไม่ใช่ standalone webpage หรือ web application
- ไฟล์ยังมี `<!doctype html>`, `<html>`, `<head>` และ `<body>` เพื่อให้ upload เป็น HTML ได้ แต่ `<head>` มีเพียง charset และ title สำหรับตรวจไฟล์
- `<body>` ต้องมีเพียง `<script data-lesson-app>` หนึ่งตัว ห้ามมี div, header, main, section, button, canvas, form หรือ UI markup อื่น
- ห้ามมี `<style>`, `<link rel="stylesheet">`, `<script src>`, Tailwind หรือ CSS framework
- เก็บใต้ `Project/interactive/chapters/`
- มี `<script data-lesson-app>` เพียงหนึ่งตัว
- เรียก `PuzzleLesson.define({...})` เพียงหนึ่งครั้ง
- มี `id`, `version`, `meta`, `mount(context)`, `reset(payload)` และ `dispose()`
- ใช้ `worldType: "3d-world-space"` สำหรับบทเรียนบน World 3D
- ใช้ id แบบ slug ภาษาอังกฤษ ตัวเลข และขีดกลาง โดยไม่ซ้ำกับบทอื่น
- ใช้ semantic version เช่น `1.0.0`
- ห้ามใช้ iframe, CDN, npm, import, ES module, network request หรือ `THREE` โดยตรง
- ห้ามสร้าง `window.context`, `window.eduSdk` หรือ lifecycle สมมติ เช่น `onPhaseChange` และ `onInteraction`
- ห้ามเรียก API สมมติ เช่น `spawnObject`, `removeObject`, `updateObject`; ต้องสร้างฉากผ่าน `context.world` ที่ได้รับใน `mount(context)` เท่านั้น
- ห้ามสร้าง header, loading, mascot, console, camera control, result screen หรือ UI กลางซ้ำ
- title, description, category และข้อมูลแสดงผลหลักมาจาก `lessonData` ของ CMS บทเรียนห้ามเขียนทับ header หลัก
- ใช้เฉพาะ public API ที่พบจาก runtime ปัจจุบันผ่าน `context.world`, `context.ui`, `context.audio`, `context.quiz`, `context.objectiveAction` และ `context.complete`
- บทเรียนใหม่เลือกใช้ primitive, group, text และ Standard Asset Library ผสมกันได้ ห้ามยึดรูปแบบกราฟิกของ Lesson 0 เป็นค่าเริ่มต้นทุกบท
- ห้ามเรียก `world.addModel()`, `addObject({ type: "model" })`, custom GLB/GLTF/FBX หรือเพิ่ม model/texture/image/audio ใหม่ แม้ไฟล์จะอยู่ origin เดียวกัน
- ตรวจ Asset ID จริงจาก `Project/interactive/assets/library/catalog.json` หรือ portable `sdk/asset-library.catalog.json`; เครื่องหมายทั่วไป เช่น `+ - × ÷` ใช้ generic text API ไม่ส่งเข้า comparison-specific prefab
- ห้ามแก้ material, geometry, renderer, scene, camera ภายใน หรือ `userData` ของ object โดยตรง
- ใช้ asset ได้เฉพาะ Asset ID ที่มีใน portable catalog ห้ามอ้าง path asset โดยตรงหรือสมมติ path

## โครงสร้าง Meta

ตรวจ schema ที่ runtime และ Lesson 0 ก่อนสร้างทุกครั้ง โดยทั่วไปบทเรียน 3D ต้องมีข้อมูลต่อไปนี้:

- `worldType`
- `lessonId`
- `description`
- `keyResult`
- `background`
- `camera`
- `welcomeMessage`
- `tooltip`
- `defaultValue`
- `editSchema`
- `howto`
- `quiz`

อย่าคัดลอกค่า Lesson 0 โดยไม่สัมพันธ์กับบทเรียนใหม่ ทุกค่าใน meta ต้องมีผลจริงต่อเนื้อหาหรือ UX ของบทนั้น

## กฎ Teacher Tools

- ทุก key ใน `editSchema` ต้องมีค่าเริ่มต้นใน `defaultValue`
- key ใน `editSchema`, `defaultValue`, `reset` และ quiz data ต้องตรงกัน
- `reset` ต้องใช้ค่าปัจจุบันจาก `values` จริง
- ห้ามสร้างช่องแก้ไขที่เปลี่ยนค่าแล้วไม่เกิดผลบนฉาก
- ชนิด input, option, min, max และ step ต้องตรงกับรูปแบบที่ runtime ปัจจุบันรองรับ
- ทดสอบค่าต่ำสุด ค่าสูงสุด และค่ากลางอย่างน้อยอย่างละหนึ่งครั้ง

## กฎ Lab

- `howto.index` เริ่มจาก 0 และเรียงต่อกัน
- ขั้นอธิบายหรือสาธิตใช้ `type: "sequence"` และยังไม่เปิดให้นักเรียนลาก
- แต่ละ step ต้องมีการเปลี่ยนแปลงที่มองเห็นและสัมพันธ์กับข้อความ เช่น focus, guideline, pulse หรือ animation สาธิต
- ห้ามใช้ animation ที่ขัดกับสาระหรือเคลื่อนวัตถุโดยไม่มีความหมาย
- ขั้นสุดท้ายใช้ `type: "freestyle"` จึงเปิด interactive ให้นักเรียนทดลองเอง
- ก่อนเปิด freestyle ให้นำวัตถุกลับตำแหน่งพร้อมใช้และล้าง placement จากการสาธิต
- สามารถใช้ drag cue ในครั้งแรกและต้องซ่อนเมื่อผู้เรียนเริ่ม interactive
- Lab สามารถแสดงสถานะถูก สีเขียว เสียง success, toast และ feedback ได้

## กฎ Quiz

- ใช้คลังคำถามตามที่ครูกำหนด ถ้าไม่ได้กำหนดให้สร้างอย่างน้อย 10 ข้อเพื่อให้ระบบสุ่ม
- data ของทุกคำถามต้องใช้ key ที่ตรงกับ `defaultValue`
- ทุกข้อเริ่มจาก state ใหม่ ห้ามใช้ placement หรือคำตอบของข้อก่อนหน้า
- วัตถุต้อง interactive ได้ทันทีใน `student-quiz` ไม่ต้องรอ howto
- การลากนับ objective action ผ่าน runtime; action รูปแบบอื่นต้องเรียก `context.objectiveAction()` เมื่อผู้เรียนลงมือครั้งแรก
- ทุกครั้งที่ state คำตอบเปลี่ยน ต้องเรียก `context.quiz.answer(correct, details)` เพื่อเก็บคำตอบล่าสุด
- ปุ่มไปข้อถัดไปต้องเปิดหลัง objective action ครั้งแรก ไม่ว่าคำตอบจะถูกหรือผิด
- ห้ามบังคับให้นักเรียนตอบถูกก่อนจึงไปต่อ
- ห้ามเฉลยหรือแสดง feedback ว่าถูก/ผิดระหว่างทำ Quiz
- ตรวจเงื่อนไขของโจทย์ ไม่ใช่เทียบกับคำตอบตัวอย่างค่าเดียว เช่น น้อยกว่า 4 ต้องยอมรับทุกค่าที่น้อยกว่า 4 ภายในขอบเขตกิจกรรม
- `details` ต้องอธิบายคำตอบได้เพียงพอสำหรับหน้าสรุปและ callback
- ตรวจว่าทุกโจทย์มีคำตอบที่เป็นไปได้ภายในจำนวนวัตถุที่ให้

## กฎ Interactive และ Drag/Drop

- เฉพาะวัตถุ interactive เท่านั้นที่ควรแสดง hover หรือข้อความว่าลากได้
- วัตถุต้องมีขนาดแตะง่ายบนมือถือและไม่ถูก UI บัง
- onDrop ต้องรองรับการวางเข้าเป้าหมาย การวางผิดพื้นที่ และการลากออกจากเป้าหมาย
- การวางผิดและไม่ได้รับการยอมรับต้องกลับตำแหน่งก่อนลาก
- การวางที่ยอมรับควร snap เข้าตำแหน่งชัดเจนและใช้ commit effect ของระบบ
- ถ้ามีหลายวัตถุ ให้เก็บ object-to-slot ด้วย Map และหา slot ว่าง ห้ามนำทุกชิ้นไปทับ slot ล่าสุด
- เมื่อนำวัตถุออก ต้องลบ placement คืน slot และส่งกลับตำแหน่งเริ่มต้นหรือจุดพักที่ถูกต้อง
- อย่าสร้าง VFX, outline, selection หรือเสียงลากซ้ำกับที่ runtime มีอยู่แล้ว

## แนวทางจัดฉากและ Mobile

- ใช้แกน Y เป็นความสูง พื้นอยู่ใกล้ Y = 0
- วางเนื้อหาหลักให้อยู่ในขอบเขต world และ camera ของ runtime ปัจจุบัน
- เว้นด้านบนสำหรับ header/callout และด้านล่างสำหรับ console
- วัตถุสำคัญ พื้นที่เป้าหมาย และวัตถุเริ่มต้นต้องมองเห็นครบตั้งแต่เปิดบท
- ใช้สีแยกโจทย์ วัตถุ interactive และพื้นที่เป้าหมายให้ชัด
- ใช้ callout, targetFocus และ guideline เท่าที่จำเป็น ห้ามบังวัตถุด้านหลัง
- กล้องหมุนและ zoom แล้วความหมายของสัญลักษณ์ต้องไม่กลับด้านหรือสับสน
- ทดสอบอย่างน้อย desktop แนวนอนและ mobile แนวตั้ง

## Lifecycle และ Cleanup

- `mount` ใช้เก็บ context และสร้าง state container เท่านั้น
- runtime จะล้าง world ก่อนเรียก `reset`; reset ต้องสร้างฉากจาก payload ปัจจุบันใหม่ทั้งหมด
- clear timer เดิมก่อนสร้าง timer ใหม่ทุกครั้งใน reset
- เก็บ timeout/interval ทุกตัวและ clear ทั้งใน reset และ dispose
- reset ต้องล้าง Map, array, placement, answer และ state จากรอบก่อน
- `onStep` ต้องหยุด animation และ cue จาก step ก่อนหน้า ก่อนเริ่ม step ใหม่
- `dispose` ต้องหยุด timer, drag cue และล้าง reference ของบทเรียน

## Workflow ที่ Codex ต้องทำ

1. อ่าน Master และ source of truth ให้ครบ
2. ตรวจ git status และรักษาไฟล์ที่ผู้ใช้แก้ไว้
3. แปลงข้อความครูเป็น values, editable fields, steps, interactions และ quiz conditions
4. ตรวจความสมเหตุสมผลของโจทย์ทุกแบบ โดยเฉพาะช่วงคำตอบและกรณีศูนย์
5. สร้างไฟล์ HTML จริงใน `Project/interactive/chapters/`
6. ตรวจ HTML/JavaScript syntax และค้นหาการใช้ API ที่ไม่มีใน runtime
7. เปิดผ่านหน้า demo และ EduSDK ด้วย relative path จริง
8. ทดสอบ `teacher-lab`, `student-lab` และ `student-quiz`
9. ทดสอบ Teacher Tools ว่าทุกช่องเปลี่ยนฉากจริง
10. ทดสอบ Quiz ทั้งคำตอบถูก ผิด ข้าม และไปข้อถัดไปโดยไม่ต้องตอบถูก
11. ทดสอบวาง object หลายชิ้น ลากออก และวางกลับ
12. ทดสอบ desktop และ mobile/แนวตั้ง
13. ตรวจ browser console ว่าไม่มี error
14. ปิด เปิดใหม่ และ reset เพื่อดูว่าไม่มี timer หรือ state ค้าง

หากรายละเอียดจากครูไม่ครบ ให้เลือกค่าเริ่มต้นที่เหมาะสมจาก pattern ของ Lesson 0 และลงมือให้เสร็จ หลีกเลี่ยงการถามศัพท์เทคนิค ถ้ากติกาการตรวจคำตอบกำกวมจนสร้างความหมายต่างกันจริง จึงถามด้วยภาษาธรรมดาไม่เกิน 3 ข้อ

## การนำไฟล์เข้าสู่ระบบสำหรับ Admin

1. ตรวจว่าไฟล์อยู่ใต้ `Project/interactive/chapters/`
2. เพิ่มหรือเลือกบทเรียนใน CMS ของเว็บหลัก
3. ให้ `lessonData.Id` ตรงกับ `id` และ `meta.lessonId` ในไฟล์
4. ส่ง path แบบ relative และ origin เดียวกัน เช่น `./interactive/chapters/lesson1.html`
5. ชื่อ คำอธิบาย หมวด และ tag ที่แสดงใน UI หลักแก้จาก CMS
6. เพิ่ม version ของบทเรียนเมื่อเปลี่ยน logic หรือโครงสร้างคำตอบ

รูปแบบ `lessonData` และ callback ต้องอ่านจากหน้า demo และ `eduSdk.js` ปัจจุบันโดยตรง ไม่คัดลอก object schema มาตรึงไว้ที่นี่ เพื่อไม่ให้ Master ล้าสมัยโดยไม่จำเป็น

## Checklist ก่อนส่งมอบ

- [ ] ไฟล์เป็น HTML UTF-8 และอยู่ใน chapters
- [ ] มี `script[data-lesson-app]` และ `PuzzleLesson.define` อย่างละหนึ่งครั้ง
- [ ] id, lessonId, ชื่อไฟล์ และ CMS ID สอดคล้องกัน
- [ ] ใช้เฉพาะ public API ปัจจุบัน
- [ ] Teacher Tools ทุกช่องเปลี่ยนฉากได้จริง
- [ ] sequence ยัง interactive ไม่ได้ และ freestyle interactive ได้
- [ ] Quiz เปิดปุ่มไปต่อหลัง objective action ครั้งแรก
- [ ] Quiz ไปต่อได้ทั้งเมื่อถูก ผิด หรือไม่ได้ตอบครบ
- [ ] Quiz ไม่เฉลยระหว่างทำและสรุปผลถูกต้อง
- [ ] วัตถุหลายชิ้นไม่ทับ slot และลากกลับได้
- [ ] reset/open/close ไม่มี state หรือ timer ค้าง
- [ ] desktop และ mobile มองเห็น objective ครบ
- [ ] browser console ไม่มี error

## ข้อผิดพลาดที่พบบ่อย

| อาการ | จุดที่ควรตรวจ |
|---|---|
| ไม่พบ `script[data-lesson-app]` | attribute ของ script, จำนวน script และโครง HTML |
| ไม่พบ `mount(context)` | lifecycle ภายใน `PuzzleLesson.define` |
| ฉากว่าง | `reset`, public world API และ browser console |
| Teacher Tools เปลี่ยนแล้วฉากไม่เปลี่ยน | key ระหว่าง defaultValue, editSchema และ reset |
| Quiz ตรวจคำตอบที่ถูกเป็นผิด | condition ถูกเขียนเป็นค่าตายตัวแทน state จริง |
| ต้องตอบถูกจึงไปต่อได้ | objective action หรือปุ่มต่อถูกผูกกับ correct |
| กล่องไปรวมตำแหน่งเดียว | Map ของ object-to-slot และการหา slot ว่าง |
| ลากออกจากคำตอบไม่ได้ | การลบ placement, คืน slot และ start position |
| ปุ่ม Quiz ไม่แสดง | action ที่ไม่ใช่ drag ไม่เรียก objectiveAction |
| ข้อใหม่มี state เดิม | reset ไม่ล้าง Map, array, answer หรือ timer |
| มือถือมองไม่เห็นเป้าหมาย | camera framing, ขอบเขต world และพื้นที่ที่ console บัง |
| เครื่องทำงานแต่ deploy ไม่ได้ | relative path, ตัวพิมพ์เล็ก/ใหญ่, origin และ asset ที่ไม่มีจริง |

## รูปแบบรายงานเมื่อ Codex ทำเสร็จ

- path ของไฟล์บทเรียนที่สร้างหรือแก้
- สรุปกิจกรรมและค่าที่ครูปรับได้
- สรุปเงื่อนไขตรวจคำตอบ
- โหมดและ viewport ที่ทดสอบ
- ผล syntax check และ browser console
- ข้อจำกัดที่ยังเหลืออยู่ตามจริง; ถ้าไม่มีให้ระบุว่าพร้อมเชื่อมผ่าน CMS
