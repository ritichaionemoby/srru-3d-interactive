# Lesson Asset Library

คลังวัตถุมาตรฐานสำหรับบทเรียน ใช้ผ่าน Asset ID ใน `catalog.json` เช่น `food/apple`, `food/pizza`, `math/balance-scale` และ `space/rocket`

- `type: prefab` ประกอบจาก primitive ของ runtime จึงเบาและไม่ต้องโหลดโมเดลภายนอก
- `type: model` คือโมเดลมาตรฐาน FBX/GLB ที่อยู่ภายในคลังและโหลดผ่าน Asset ID เท่านั้น เช่น `food/carrot`
- บทเรียนสามารถเปลี่ยนตำแหน่ง rotation scale สี และ interaction ได้
- prefab ที่ประกอบจากหลาย primitive ใช้ Highlight กลางของ runtime โดยอัตโนมัติ ได้แก่ Material Tint ทั้งกลุ่ม วงแหวนใต้ฐาน และ Marker ลอยเหนือวัตถุ จึงไม่มีเส้น Outline ซ้อนตามชิ้นส่วนภายใน
- TEACHER_EXTERNAL ใช้ได้เฉพาะ Asset ID ใน catalog และ primitive ของ Public API ห้ามเพิ่มไฟล์หรือเรียก `world.addModel()`
- DEV_WORKSPACE ใช้ custom GLB/GLTF/FBX ผ่าน `world.addModel()` ได้เมื่อคำสั่งงานอนุญาต และควรลงทะเบียนของที่ต้องการแชร์ให้อาจารย์เป็น Standard Asset ID
- ห้ามลบหรือเปลี่ยนความหมาย Asset ID ที่เผยแพร่แล้ว ให้เพิ่ม ID/version ใหม่เพื่อไม่ทำให้บทเรียนเก่าพัง
