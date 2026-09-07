/** ค่ากลางของ runtime แก้หน้าตา/เสียงได้โดยไม่ต้องแตะ main-world.js */
export const mainWorldSetting = {
  // ระบบ cache สำหรับไฟล์ asset เท่านั้น (ภาพ, SVG, texture, เสียง และ BGM)
  // false ระหว่างพัฒนา: เติมเวลาปัจจุบันเพื่อบังคับโหลดไฟล์ล่าสุดทุกครั้ง
  // true ตอน deploy: ใช้ assetVersion คงที่ และเปลี่ยนเลขนี้เมื่อมีการอัปเดต asset
  isCache: false,
  assetVersion: "0.0.1",
  // true = ใช้ meta.title/category/subcategory จากไฟล์ lesson เป็นชื่อแสดงผลหลักเสมอ
  // false = ใช้ lessonData จาก Platform ก่อน และ fallback ไป meta เมื่อไม่ได้ส่งมาหรือเป็นค่าว่าง
  overrideTitleName: true,
  renderer: {
    maxPixelRatio: 1.5, exposure: 1.25, toneMapping: "neutral", enableShadows: true,
    // ลดภาระ GPU อัตโนมัติบนหน้าจอแคบ/อุปกรณ์สเปกต่ำ โดยไม่เปลี่ยนหน้าตาของบทเรียน
    adaptiveQuality: true,
    mobilePixelRatio: 1.15,
    desktopShadowMapSize: 1024,
    mobileShadowMapSize: 512,
    // Desktop เรนเดอร์ตาม refresh rate ตลอดเวลาเพื่อให้ VFX/ฉากเคลื่อนไหวต่อเนื่อง
    // Mobile เท่านั้นที่ลดรอบหลังไม่มี interaction ตามเวลาที่กำหนด
    mobileIdleDelay: 12000,   // รอ 12 วินาทีก่อนเข้าโหมดประหยัดบนมือถือ
    mobileIdleFps: 45,        // ลดเพียงเล็กน้อย เพื่อไม่ให้ฉากดูค้างหรือกระตุก
    distantAnimationFps: 24,  // ความถี่ขยับโมเดล/เมฆระยะไกล
    shadowAutoUpdate: false   // คำนวณเงาใหม่เฉพาะตอนฉาก กล้อง หรือวัตถุเปลี่ยน
  },
  camera: {
    fov: 44, startYaw: 38, startPitch: 38, startDistance: 18,
    minDistance: 8, maxDistance: 30, minPitch: 18, maxPitch: 78,
    target: [0, 0.25, 0],
    fogZoom: {
      enabled: true,             // ให้ความหนา fog เปลี่ยนตามระยะซูม
      baseNearOffset: -2,        // ดึงจุดเริ่ม fog เข้ามาเล็กน้อย ให้เห็นมิติระหว่างหน้าและหลัง
      baseFarOffset: 2,          // ไม่ผลักปลาย fog ออกไปไกลจนแทบมองไม่เห็น
      nearChangePerUnit: 1.2,    // ซูมออก: fog บางลง / ซูมเข้า: fog หนาขึ้น
      farChangePerUnit: 1.6,
      minNearOffset: -6, maxNearOffset: 12,
      minFarOffset: -8, maxFarOffset: 20
    },
    mobileDistanceScale: 1.9,     // ระยะเริ่มต้นบนจอแนวตั้ง เพื่อให้เห็นพื้นที่บทเรียนครบ
    mobileMaxDistanceScale: 1.5   // ขยายเพดาน pinch zoom-out บนมือถือจาก maxDistance ปกติ
  },
  lighting: {
    hemisphere: 1.5,       // แสงรวมระดับกลาง เปิดผิวเกาะโดยยังรักษาความอิ่มสี
    skyColor: "#eefbff",    // สีแสงจากด้านบน
    groundColor: "#c8d8c7",// สีสะท้อนจากพื้น ใช้สีสว่างเพื่อเปิดรายละเอียดใต้เกาะ
    ambient: 0.16,          // เติมเงาลึกให้อ่านรายละเอียดได้โดยไม่ทำให้ฉากแบน
    ambientColor: "#dcecff",
    key: 1.5,               // เพิ่มแสงหลักเพื่อให้ผิวและ normal อ่านรูปทรงชัดขึ้น
    fill: 0.64,             // เปิดรายละเอียดด้านมืดให้สว่างขึ้นโดยไม่พึ่ง Exposure อย่างเดียว
    fillColor: "#c8c5ff",
    mint: 0.3,              // แสงแต้มสีเขียวมิ้นต์เล็กน้อย
    peach: 0.25,            // แสงแต้มสีส้มอ่อน
    rim: 0.95,              // เพิ่มขอบสว่างด้านไกลให้แยกจาก fog ชัดขึ้น
    rimColor: "#fff0c7",
    rimDistance: 18,         // ระยะไฟด้านหลังจาก pivot กล้อง
    rimHeight: 10,           // ความสูงของไฟ rim เหนือ pivot
    shadowRadius: 4,
    shadowNormalBias: 0.035
  },
  ground: {
    radius: 14,              // รัศมีพื้นที่ grid วงกลม
    gridSize: 1.4,           // ระยะห่างแต่ละช่อง
    gridColor: "#ffffff",   // สีเส้น grid
    gridOpacity: 0.15,
    ringColor: "#7891ab",   // สีขอบวงกลม
    shadowOpacity: 0.12,     // เงารอง object บนพื้น
    island: {
      enabled: true,         // ปิดได้ทันทีหากต้องการกลับไปใช้ Grid ลอยแบบเดิม
      model: {
        enabled: true,       // true ใช้ไฟล์โมเดล; false ย้อนกลับไปใช้เกาะ Procedural เดิมทันที
        path: "./assets/model/main-island3/island.fbx",
        position: [0, 0.65, 0], // offset หลัง auto-fit [x, y, z]; ปรับ y เพื่อเลื่อนผิวเกาะเทียบกับ grid
        rotation: [0, 0, 0], // มุมโมเดลหน่วยองศา [x, y, z]
        scale: [1.1, 1.1, 1.1], // ตัวคูณหลัง auto-fit; เช่น [1.15, 1, 1.15] ขยายแนวราบ 15%
        gridHeight: 0.18,    // ระดับ Y ของ grid เฉพาะโหมด Model; Procedural ใช้ระดับผิวมาตรฐานอัตโนมัติ
        decorationPlacement: {
          followSurface: true, // ยิง ray ลงหาผิวโมเดลแยกแต่ละกอ ป้องกันหญ้า/ดอกไม้จมเมื่อเกาะไม่เรียบ
          heightOffset: 0.05,  // ระยะยกโคนของตกแต่งเหนือผิวที่ตรวจพบ
          rayHeight: 30,       // จุดเริ่มยิง ray เหนือเกาะ เพิ่มเมื่อนำโมเดลที่สูงกว่านี้มาใช้
          flowerSinkRatio: 0.25   // 0 = วางโคนดอกไม้บนผิว; เพิ่มเล็กน้อยเมื่อต้องการฝังโคนลงในเกาะ
        },
        autoFit: {
          enabled: true,     // ปรับขนาด FBX และจัดกึ่งกลางอัตโนมัติ
          targetDiameter: 27.4, // เส้นผ่านศูนย์กลางที่ต้องการ ใกล้เคียง grid radius 13.7
          surfaceY: 0        // ระดับผิวบนของโมเดลก่อนบวก position.y
        },
        // ไฟล์ runtime 2K ลด GPU memory; ไฟล์ 4K ต้นฉบับยังเก็บชื่อเดิมไว้สำหรับสลับกลับ
        baseColorTexturePath: "./assets/model/main-island3/rgb-runtime.jpg",
        normalTexturePath: "./assets/model/main-island3/normal-runtime.jpg",
        materialType: "standard", // main-island3 ไม่มี PBR: ไม่ใช้ Physical/Clearcoat จากโมเดลเก่า
        textureColorRetentionNear: 1,   // ผิวใกล้กล้อง: ใช้สี texture เต็มเพื่อให้ใกล้ไฟล์ต้นฉบับที่สุด
        textureColorRetentionFar: 0.05, // ผิวไกลกล้อง: รับสีแสงและ fog มากขึ้นเพื่อสร้างมิติ
        textureColorFadeNear: 12,       // ภายในระยะนี้ยังใช้สีฝั่งใกล้เต็มที่
        textureColorFadeFar: 30,        // ระยะที่ไล่สีไปถึงค่าฝั่งไกลครบ (ต้องมากกว่า FadeNear)
        materialColor: "#ffffff", // สีคูณกับ base color
        roughness: 0.88,     // ผิวด้านนุ่ม ใช้ค่าคงที่แทน roughness map
        useRoughnessMap: false,
        metalness: 0,        // เกาะไม่ใช่โลหะ ป้องกันผิวดำจาก environment reflection
        useMetalnessMap: false,
        normalScale: 0.48,   // normal ใหม่แบบอ่อน: เพิ่มผิวหญ้า/ดินโดยไม่ทำให้เกาะแข็งหรือขรุขระเกินไป
        envMapIntensity: 0   // ไม่มี PBR/environment reflection ปนกับสี texture ของ main-island3
      },
      radius: 13.72,         // รัศมีหน้าหญ้าและสันดิน ใช้ขนาดเดียวกันเพื่อไม่ให้ดินยื่นออกด้านข้าง
      grassEdgeInset: 0.1,   // เว้นหน้าหญ้าเข้าด้านในเล็กน้อยเพื่อให้เห็นสันดิน โดยไม่เพิ่มขนาดเกาะ
      bottomRadius: 11.85,   // ฐานล่างแคบลงเพื่อให้เห็นทรงเกาะและผิวดินชัดขึ้น
      height: 3.2,           // ความลึกของชั้นดินด้านข้าง
      straightEdgeHeight: 0.9, // ช่วงสันดินที่ Extrude ลงตรงๆ ก่อนเริ่มโค้งสอบเข้าด้านล่าง
      curveSegments: 7,      // ความละเอียดของช่วงดินที่ค่อยๆ โค้งเข้าหาฐานล่าง
      topColor: "#e3f2e7", // ใช้เป็นสีสำรองระหว่างรอโหลด texture
      topTint: "#b5e4bd",  // สีคูณกับ texture หญ้า ใช้ปรับโทนโดยไม่แก้รูป
      sideColor: "#e1a06d", // สีคูณ texture ดิน ช่วยให้สันดินอ่านรูปทรงได้ชัดในฉากสว่าง
      edgeColor: "#a9653f", // สีดินเส้นบางตรงรอยต่อระหว่างหน้าหญ้ากับสันดิน
      bottomColor: "#765538",
      rimColor: "#9ad58b",
      topTexturePath: "./assets/image/texture/island-grass.png",
      sideTexturePath: "./assets/image/texture/island-soil.png",
      topTextureRepeat: [3, 3],
      sideTextureRepeat: [8, 0.28],
      textureDotColor: "#68bda3",
      textureStarColor: "#e8b94f",
      textureOpacity: 0.46,
      quietZone: {
        enabled: true,         // ลดรายละเอียด texture บริเวณกลางเกาะเพื่อให้โจทย์อ่านง่าย
        radius: 9.35,
        color: "#d9f0d5",
        opacity: 0.06
      },
      cloudBase: {
        enabled: false,        // ปิดไว้เป็นค่าเริ่มต้น เพราะเมฆอาจซ้อนทับฐานเกาะ; เปิด true เมื่อต้องการทดลองใช้
        count: 16,
        radius: [11.2, 14.2],
        y: [-2.45, -1.25],
        scale: [0.8, 1.65],
        colors: ["#ffffff", "#eaf8ff", "#f4ecff"],
        opacity: 0.88,
        floatAmount: 0.13,
        floatSpeed: 0.00045
      },
      decorations: {
        enabled: true,        // หญ้าและดอกไม้ 3D เตี้ย ๆ รอบขอบเกาะ
        grassCount: 34,
        flowerCount: 12,
        innerRadius: 9.2,     // เว้นพื้นที่กลางเกาะให้บทเรียนใช้งาน
        outerRadius: 12.6,
        offsetXZ: [0, 0],    // ให้ของตกแต่งอยู่กึ่งกลางเดียวกับโมเดลเกาะ
        grassBaseY: 0.025,    // กอหญ้าใช้ระดับเดิม
        flowerBaseY: -0.14,   // ดอกไม้จมชิดผิวโมเดลหญ้า
        flowerSinkRatio: 0.6, // กดดอกไม้ลง 60% ของความสูงแต่ละต้น
        maxHeight: 0.48,
        grassColors: ["#55b96f", "#73cf7c", "#9cdd75"],
        flowerColors: ["#ff8fb4", "#ffd05f", "#9b8cf2", "#ffffff"],
        swayAmount: 0.08,
        swaySpeed: 0.0018,
        shadow: {
          enabled: true,       // เงาฟุ้งจำลองใต้ของแต่งเกาะ ใช้ GPU Instancing เพียงชุดเดียว
          enabledOnMobile: false, // มือถือไม่สร้าง mesh/texture เงาชุดนี้ เพื่อลดทั้ง GPU และ memory
          flowerOnly: true,    // true = แสดงเฉพาะใต้ดอกไม้; false = แสดงใต้กอหญ้าด้วย
          color: "#294f37",   // สีเขียวเข้มแทนสีดำ ทำให้เห็นชัดแต่ยังกลมกลืนกับพื้นหญ้า
          opacity: 0.4,        // ความเข้มที่อ่านได้ในฉากสว่าง; texture จะไล่ขอบให้ฟุ้งเอง
          size: [0.96, 0.56],  // ขนาดวงรี [กว้าง, ยาว] หน่วย world
          sizeVariation: 0.16, // ความแตกต่างของขนาดแต่ละต้น ป้องกันภาพซ้ำเป็นระเบียบเกินไป
          heightOffset: 0.08   // ยกตาม normal ของผิว ป้องกันเงาจมใน texture/geometry ที่ขรุขระ
        }
      }
    }
  },
  backgroundPresets: {
    // ปัจจุบันทุกบทเรียนใช้ฉาก Green เดียวกัน อนาคตค่อยเพิ่ม Day / Evening / Night
    // โดยเปลี่ยนเฉพาะโทนสี หมอก และแสง ไม่เปลี่ยน panorama หรือชุดฉาก
    green: {
      colors: ["#78ccec", "#c8f3dc", "#f6ffe8"], fog: "#d8f5e8", fogNear: 31, fogFar: 70,
      // มือถือใช้กล้องไกลกว่า desktop จึงแยกระยะหมอกเพื่อไม่ให้รายละเอียดหายเร็วเกินไป
      mobileFog: { color: "#d8f5e8", near: 48, far: 104 },
      // สีและ opacity ของ Grid ไม่อยู่ใน background อีกต่อไป ให้แก้ที่ ground เท่านั้น
      panorama: "./assets/image/skybox-workshop-panorama.png",
      particleColors: ["#ffffff", "#d9ffbf", "#80d6aa", "#fff0a8"],
      windColors: ["#ffffff", "#70d6bd"],
      leafColors: ["#67c879", "#a9df75", "#70d6bd", "#e6ee92"],
      bgm: "", particles: ["dust", "leaves"]
    }
  },
  skyboxLayout: {
    // ทรงกระบอกด้านในสำหรับ panorama: y คือจุดกึ่งกลางภาพใน world
    panorama: { radius: 40, height: 36, y: 4, opacity: 0.94, rotationY: 0 },
    floor: {
      enabled: true,          // พื้นล่างแยกจาก panorama โดยสิ้นเชิง ไม่เปลี่ยนภาพ skybox เดิม
      texturePath: "./assets/image/texture/skybox-floor-vista.png",
      radius: 58,
      y: -14,                // ปรับแกน Y ของพื้นเพียงอย่างเดียว: ค่ายิ่งติดลบ พื้นยิ่งอยู่ต่ำ
      opacity: 0.58,
      fogStrength: 0.25,    // รับ fog เพียงบางส่วนเพื่อให้ยังเห็นรายละเอียด texture พื้นล่าง
      edgeFadeStart: 0.58,   // ตำแหน่งที่เริ่มจางจากกึ่งกลางพื้น: ค่ายิ่งน้อย ช่วง blend ยิ่งกว้าง
      edgeFadeEnd: 0.98,     // ตำแหน่งที่จางจนโปร่งใสทั้งหมดบริเวณขอบ
      rotationY: 0
    }
  },
  distantDecor: {
    enabled: true,            // โหลดโมเดลตกแต่งจริงไว้ไกลรอบเกาะ เพื่อสร้าง Parallax
    count: 16,                // จำนวนชิ้นที่วางจริง; ระบบวนใช้ไฟล์ทั้ง 8 แบบเมื่อ count มากกว่า 8
    radius: [44, 56],         // อยู่ไกลจากกล้องทุกมุม ลดการชนขอบจอและรับ fog แบบฉากหลัง
    roughness: 0.72,
    fog: true,                // ให้โมเดลระยะไกลกลืนเข้ากับสี Fog ของฉาก
    opacity: 0.82,             // ลดความคมของ silhouette เพิ่มเติมก่อนผสมกับ Fog
    models: [
      // height/scale เป็นช่วงสุ่มเฉพาะโมเดลนั้น ส่วน rotate:false จะรักษาองศาจากไฟล์และไม่หมุนเอง
      { path: "./assets/model/deco/deco1.glb", texture: "./assets/model/deco/deco1.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco2.glb", texture: "./assets/model/deco/deco2.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco3.glb", texture: "./assets/model/deco/deco3.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco4.glb", texture: "./assets/model/deco/deco4.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco5.glb", texture: "./assets/model/deco/deco5.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco6.glb", texture: "./assets/model/deco/deco6.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco7.glb", texture: "./assets/model/deco/deco7.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false },
      { path: "./assets/model/deco/deco8.glb", texture: "./assets/model/deco/deco8.png", height: [-15, 0], scale: [1.8, 3.4], rotate: false }
    ],
    floatAmount: 0.28,
    driftAmount: 0.34,
    floatSpeed: 0.00072,
    spinSpeed: 0.00042
  },
  distantClouds: {
    enabled: true,             // เมฆเป็นระบบและ asset แยกจาก distantDecor โดยสิ้นเชิง
    // จัดโมเดลให้ด้านยาวอยู่แกน X และด้านหน้าหันทาง +Z ระบบจะหัน +Z เข้าหาเกาะให้อัตโนมัติ
    model: { path: "./assets/model/cloud/cloud.glb", texture: "./assets/model/cloud/cloud.png" },
    count: 11,
    radius: [34, 48],          // สลับใกล้/ไกลรอบเกาะเพื่อสร้าง Parallax
    height: [-15, 5],          // ชดเชยมุมกล้องก้ม ให้เมฆปรากฏตามแนวท้องฟ้าด้านหลังเกาะ
    scale: [3.2, 7],           // ขนาดเป้าหมายหลัง normalize โมเดล
    colors: ["#ffffff", "#dff5ff", "#f0e7ff"],
    roughness: 0.86,
    fog: true,                // ใช้ opacity ทำให้เมฆนุ่มโดยไม่ถูก fog กลืนจนหาย
    opacity: 0.76,
    floatAmount: 0.3,
    floatSpeed: 0.00068,
    radialDrift: 0.28,
    orbitSpeed: [0.000006, 0.000014] // ความเร็วโคจรรอบเกาะ โดยโมเดลจะหันหน้าเข้าหาเกาะเสมอ
  },
  object: {
    textureRepeat: [2, 2], // ความถี่ลายจุดนุ่มที่ระบบสร้างให้กล่องบทเรียน
    ambientOcclusion: { enabled: true, intensity: 0.72 },
    surface: {
      roughness: 0.48, clearcoat: 0.58, clearcoatRoughness: 0.2,
      sheen: 0.5, sheenRoughness: 0.55, emissiveIntensity: 0.035
    },
    highlight: {
      enabled: true,
      hover: {
        tint: "#ffffff",       // Hover ฟอกวัตถุให้เกือบขาว เพื่อบอกชัดเจนว่าสามารถโต้ตอบได้
        strength: 0.72,
        emissiveStrength: 0.24,
        ringColor: "#ffffff",
        ringOpacity: 0.48
      },
      ring: {
        enabled: true,          // วงแสงบนพื้นแสดงเฉพาะตอน Hover
        padding: 0.3,           // ระยะเพิ่มจากขอบ Bounding Box ของวัตถุ
        minRadius: 0.58,
        heightOffset: 0.055,    // ยกเหนือพื้น ป้องกัน z-fighting
        thickness: 0.045,
        pulseAmount: 0.025,
        pulseSpeed: 0.0022
      },
      marker: {
        enabled: true,            // เปิด/ปิดลูกศรเหนือ object ที่เลือก (ไม่เปลี่ยนสีผิววัตถุ)
        path: "./assets/model/marker/selected-marker.fbx", // โมเดล Marker ที่คุณสามารถเปิดแก้และ export ทับได้
        size: 0.6,               // ขนาดรวมของเพชร (เพิ่มค่านี้เพื่อขยาย)
        height: 0.65,             // ระยะห่างระหว่างเพชรกับยอด object
        modelOffset: [0, 0, 0],   // เลื่อนโมเดลภายใน marker [x, y, z]
        modelRotation: [0, 0, 0], // หมุนโมเดลเริ่มต้นเป็นองศา [x, y, z]
        // ตั้งชื่อ Mesh ให้มี Edge/Border, Core/Inner หรือ Spark/Star เพื่อเลือกชุดสีด้านล่าง; ชื่ออื่นใช้ color
        color: "#57e9ff",        // สีผลึกหลัก
        secondaryColor: "#ffffff", // สีแกนสว่างด้านใน
        edgeColor: "#5369dc",    // สีเปลือก/ขอบด้านนอก
        sparkleColor: "#fffb11", // สีประกายที่โคจรรอบเพชร
        topRing: {
          enabled: true,          // วงแหวนที่ลอยอยู่เหนือ Marker
          color: "#ffffff",
          edgeColor: "#14a1ff",
          size: 0.34,
          thickness: 0.035,
          height: 0.58,           // ระยะเหนือจุดกึ่งกลางของ Marker
          counterMotion: 2        // 2 = เคลื่อนสวนทางกับจังหวะลอยของ Marker ชัดเจน
        },
        spinSpeed: 0.00075,      // ความเร็วหมุนรอบแกนชี้เป้าหมายของ Marker
        sparkleSpeed: 0.0018,    // ความเร็วประกายที่โคจรรอบ
        bobSpeed: 0.0024,
        bobHeight: 0.08,
        pulseAmount: 0.035,
        pulseSpeed: 0.0028
      }
    },
    motion: {
      liftHeight: 0.38,      // ยก object จากพื้นเมื่อเริ่มลาก
      returnDuration: 320,   // เวลากลับจุดเริ่มเมื่อวางผิด
      settleDuration: 420,   // เวลาเด้งนุ่มหลังวางถูก
      dropBounceHeight: 0.34,
      dropSquash: 0.1
    },
    commit: {
      enabled: true, duration: 780, flashes: 3,
      color: "#ffffff", emissiveIntensity: 0.62
    },
    spawn: { enabled: true, duration: 520, stagger: 70, overshoot: 1.7 }
  },
  lessonGraphics: {
    zone: {
      floorOpacity: 0.34,     // ความโปร่งใสของพื้นพื้นที่โจทย์/คำตอบ
      borderColor: "#7060d4",
      borderOpacity: 0.88,
      dashSize: 0.32,
      gapSize: 0.18,
      cornerMarkerColor: "#ffffff"
    },
    operatorBase: {
      neutralBase: "#eeeaff", neutralEdge: "#9f8be8", topColor: "#fffaff",
      validBase: "#ddfaeb", validEdge: "#5bc594"
    }
  },
  interaction: {
    dragPadding: 1.5, rotateSpeed: 0.007, tiltSpeed: 0.005,
    wheelZoomSpeed: 0.018, defaultDragAxis: "xz",
    guideline: {
      color: "#ff9100ff", dashSize: 0.15, gapSize: 0.1, flowSpeed: 0.025,
      arrowSize: 0.22,       // ความกว้างหัวลูกศรปลายเส้น
      arrowLength: 0.52     // ความยาวหัวลูกศรปลายเส้น
    },
    targetFocus: {
      color: "#ffffff",       // วงชี้เป้าหมายใช้สีขาวกลางทุกบทเรียน
      radius: 2.15,            // รัศมีเริ่มต้นของวง
      opacity: 1.0,
      dashSize: 0.38,          // ความยาวของเม็ดเส้นปะแต่ละช่วง
      gapSize: 0.22,           // ช่องว่างระหว่างเม็ดเส้นปะ
      dashWidth: 0.105,        // ความหนาแนวราบของเม็ดเส้นปะ
      dashHeight: 0.055,       // ความสูงเล็กน้อยให้เม็ดเส้นปะดูนุ่ม ไม่แบนติดพื้น
      pulseScale: 0.024,       // ขยาย/หดอย่างสุภาพเพื่อไม่แย่งจุดเด่น
      pulseSpeed: 0.00105,     // ความเร็วหายใจของวง ยิ่งน้อยยิ่งช้า
      opacityPulse: 0.08,      // เปลี่ยนความโปร่งใสเพียงเล็กน้อยระหว่างหายใจ
      rotateSpeed: 0.00012     // หมุนช้ามาก ประมาณหนึ่งรอบต่อ 52 วินาที
    }
  },
  audio: {
    enabled: true, sfxVolume: 0.70, bgmVolume: 0.18,
    bgmPath: "./assets/bgm/bgm1.mp3", // ใช้เป็น BGM กลางเมื่อ theme ไม่ได้กำหนด bgm ของตัวเอง
    // เพิ่ม/ลดความดังรายเหตุการณ์โดยคูณกับ sfxVolume
    eventVolume: { onClick: 0.9, onDrag: 1, onDrop: 1.35, onUiBtnClick: 0.75, success: 1.1, fail: 1, nextQuest: 0.9, startLesson: 0.9, completeLesson: 1.05 },
    useSynthFallback: false, // path ว่าง = ไม่มีเสียง ไม่สร้างเสียงสำรองอัตโนมัติ
    sfx: {
      onClick: "./assets/sfx/object-pick.wav",
      onDrag: "./assets/sfx/object-drag.wav",
      onDrop: "./assets/sfx/object-drop.wav",
      onUiBtnClick: "./assets/sfx/ui-click.wav",
      success: "./assets/sfx/success.wav",
      fail: "./assets/sfx/fail.wav",
      nextQuest: "./assets/sfx/next-question.wav",
      startLesson: "./assets/sfx/start-lesson.wav",
      completeLesson: "./assets/sfx/complete-lesson.wav"
    }
  },
  vfx: {
    particles: true, dropSpark: true, celebration: true,
    celebrationEffect: {
      duration: 6800,          // ระยะเวลารวมของเอฟเฟกต์ยินดี
      fireworkCount: 6,        // จำนวนตำแหน่งพลุที่เล่นวนด้านหลังริบบอน
      fireworkParticles: 16,   // จำนวนประกายต่อพลุหนึ่งชุด
      fireworkLoop: 2200,      // รอบ animation ของพลุแต่ละตำแหน่ง
      colors: ["#ff72a8", "#ffd45f", "#6be0ba", "#78c9ff", "#a88cf4", "#ffffff"]
    },
    // สี particle ของบรรยากาศอ่านจาก backgroundPresets.green
    environment: {
      count: 220, size: 0.15, opacity: 0.9, windTrails: 14,
      leafCount: 24, leafSize: [0.12, 0.23], leafFallSpeed: [0.0012, 0.0024],
      leafDrift: [0.002, 0.0055]
    },
    drop: { particleCount: 18, particleSize: 9, spread: 110 }
  },
  entry: {
    loadingImagePath: "./assets/image/welcome-workshop.png", // ภาพพื้นหลังระหว่างโหลดบทเรียน
    quizWelcomeImagePath: "./assets/image/quiz-welcome.png", // ภาพปกหน้าต้อนรับก่อนเริ่ม Quiz
    characterImagePath: "./assets/character/dinosaur-student/idle.png", // ภาพสำรองของไดโนในหน้าโหลด
    minDuration: 1700,      // ให้เวลาอ่าน welcomeMessage และกันหน้ากระพริบ
    exitDuration: 650
  },
  mascot: {
    enabled: true,                          // เปิด/ปิดผู้ช่วย หากปิดจะกลับไปแสดงกล่องคำแนะนำแบบเดิม
    name: "น้องไดโน",
    behavior: "stationary",
    renderer: "image",                     // renderer เผื่อเปลี่ยนเป็น lottie ภายหลัง
    assets: {
      idle: "./assets/character/dinosaur-student/idle.png",
      instruction: "./assets/character/dinosaur-student/point.png",
      hint: "./assets/character/dinosaur-student/thinking.png",
      celebrate: "./assets/character/dinosaur-student/celebrate.png",
      perch: "./assets/character/dinosaur-student/small-floating-island.png"
    },
    character: {
      // ตำแหน่งและขนาดตัวไดโน แยกจากกล่องคำพูดและบับเบิ้ล
      // x: ระยะจากซ้าย, idleY/speakingY: ระยะจากล่าง, width: ความกว้างตัวละคร
      desktop: { width: 340, x: 5, idleY: 82, speakingY: 82 },
      // Mobile แบบ Visual Novel: ปรับขนาดและตำแหน่งได้อิสระ
      mobile: { width: 168, x: -80, idleY: 0, speakingY: 0 }
    },
    messaging: {
      defaultType: "hint",                  // option ที่ไม่ระบุ type จะเป็น hint ยกเว้นข้อความแรกของบทเรียน
      firstMessageType: "instruction",      // ข้อความแรกเปิดอัตโนมัติ เพื่อไม่ให้เด็กพลาดคำแนะนำสำคัญ
      hintAutoRevealAfter: 10000,             // hint เปิดเองเมื่อไม่มี action ตามเวลานี้; 0 = ไม่เปิดเอง
      noticeLabel: "มีคำแนะนำใหม่",
      typeIcons: { instruction: "book.svg", hint: "lightbulb.svg", optional: "lightbulb.svg" }
    },
    idle: {
      blinkInterval: [2800, 5200],          // ช่วงสุ่มเวลากระพริบตา หน่วยมิลลิวินาที
      blinkDuration: 150
    },
    speech: {
      textSpeed: 22,                        // ความเร็วพิมพ์ข้อความ ยิ่งน้อยยิ่งเร็ว
      // กล่องคำพูดแยกจากตัวละครโดยสมบูรณ์
      // x: ระยะจากซ้าย, y: ระยะจากล่าง, width/maxWidth: ขนาดกล่อง
      desktop: { x: 250, y: 270, width: 300, maxWidth: 350 },
      mobile: { x: "clamp(118px, 31vw, 142px)", y: 180, width: "calc(100% - clamp(130px, 34vw, 154px))", maxWidth: 330 }
    },
    noticeBubble: {
      // บับเบิ้ลเครื่องหมายคำแนะนำ แยกจากทั้งตัวละครและกล่องคำพูด
      // x: ระยะจากซ้าย, y: ระยะจากล่าง, size: ขนาดบับเบิ้ล
      desktop: { x: 275, y: 270, size: 88 },
      mobile: { x: 105, y: 285, size: 64 }
    },
    particles: {
      enabled: true, count: 12,
      colors: ["#fff4a8", "#9cebd3", "#d8c8ff", "#ffffff"],
      spreadX: 150, spreadY: 180,
      size: [4, 9], duration: [1800, 3200]
    },
    animation: {
      flyInDuration: 560,                     // เวลา transition เข้าสู่สถานะพูด
      messageDelay: 330,                      // เวลาก่อนแสดงกล่องข้อความ
      landingDuration: 220,
      flyOutDuration: 520,
      flapDuration: 390,
      hoverFlapDuration: 620,
      hoverBobDuration: 1850
    }
  },
  ui: {
    theme: "felt", // สลับเป็น "default" เพื่อกลับหน้าตาเดิม โดยไม่กระทบโครงสร้างและ event ของ UI
    topbar: {
      height: 80, mobileHeight: 68, compactHeight: 58,
      backgroundOpacity: 0.34, // ความทึบเฉพาะพื้นหลัง Header: 0 = ใสทั้งหมด, 1 = ทึบทั้งหมด
      blur: 14,                // ความเบลอของฉากด้านหลัง Header หน่วย px
      backgroundStart: "238 250 255", backgroundMiddle: "218 243 255", backgroundEnd: "239 232 255",
      borderColor: "rgba(255, 255, 255, 0.42)", accentStart: "#7857ff", accentMiddle: "#61d5ac", accentEnd: "#ffd05e",
      titleStart: "#263d5c", titleMiddle: "#5949b7", titleEnd: "#287c68", subtitleColor: "#66809a",
      buttonBackground: "rgba(255, 255, 255, 0.48)", buttonHover: "#ebe6ff", buttonColor: "#42506b", buttonBorderColor: "rgba(255, 255, 255, 0.62)",
      feltBackground: "#fff1d2", feltBorderColor: "#e5c992", feltTitleColor: "#164d72",
      feltButtonBackground: "#fff6df", feltButtonBorderColor: "#dec18a", feltButtonColor: "#334b70"
    },
    // ป้าย LAB / TEACHER LAB ใน Topbar — ระบบกลางเป็นผู้กำหนดข้อความ
    modeBadge: {
      backgroundStart: "#eeeaff", backgroundEnd: "#e6f5ff", borderColor: "rgba(120, 87, 255, 0.14)",
      textColor: "#6654c6", radius: 999, fontSize: 10,
      feltBackground: "#fff6df", feltBorderColor: "#dec18a", feltTextColor: "#334b70"
    },
    // ป้าย PRE-TEST ใต้ Topbar — แสดงเฉพาะโหมด Quiz
    quizBadge: {
      background: "#7439a7", borderColor: "#e0bd80", textColor: "#ffffff", radius: 18,
      topGap: 10, left: 10
    },
    // Modal/Information/Quiz Welcome/Result ใช้ฐาน Popup เดียวกัน
    popup: {
      width: "min(560px, calc(100vw - 28px))", maxHeight: "min(680px, calc(100vh - 36px))",
      background: "linear-gradient(145deg, #ffffff, #f3f8ff 56%, #f4efff)", backdrop: "rgba(36, 52, 80, 0.35)",
      borderColor: "rgba(255, 255, 255, 0.8)", textColor: "#34415f", radius: 28, blur: 9
    },
    // ข้อความประกาศสั้นด้านบนจาก context.ui.topMessage (ไม่ใช่โจทย์และไม่บล็อกหน้าจอ)
    topMessage: {
      width: "min(440px, calc(100vw - 28px))", fontSize: "14px", duration: 1800,
      background: "linear-gradient(120deg, rgba(34, 53, 91, 0.96), rgba(87, 70, 178, 0.95))",
      borderColor: "rgba(255, 255, 255, 0.82)", textColor: "#ffffff", radius: 18
    },
    questionPanel: {
      label: "โจทย์",                         // หัวข้อเล็กเหนือข้อความที่ lesson ส่งผ่าน context.ui.setQuestion()
      width: "min(620px, calc(100vw - 420px))", // เว้นพื้นที่ซ้าย/ขวาให้ badge และปุ่ม Quiz บน desktop
      top: "calc(var(--topbar-height) + 14px)", // ตำแหน่งใต้ Header
      background: "linear-gradient(120deg, rgba(255,255,255,.94), rgba(235,247,255,.92) 56%, rgba(243,237,255,.92))",
      borderColor: "rgba(255, 255, 255, 0.82)", textColor: "#2f405c", labelColor: "#7864d2",
      iconBackground: "linear-gradient(145deg, #725cdf, #8c77eb)", radius: 21, fontSize: 17,
      feltBackground: "#fff2d6", feltBorderColor: "#dfc08a", feltIconBackground: "#7657d8"
    },
    // Main Console ด้านล่าง ใช้ร่วมกันทุกบทเรียนและมี layout แยก Desktop/Mobile
    console: {
      desktop: {
        width: "min(840px, calc(100% - 280px))",
        quizWidth: "min(760px, calc(100% - 300px))",
        bottom: 14,
        minHeight: 112
      },
      mobile: {
        width: "calc(100% - 16px)",
        bottom: 8,
        minHeight: 128
      },
      backgroundStart: "#fffdf4",
      backgroundEnd: "#eaf5ff",
      borderColor: "#dfc08a",
      textColor: "#30405b",
      objectiveColor: "#34745d",
      radius: 28,
      iconSize: 64
    },
    // ตัวเลือก Screen-space ที่ lesson เรียกผ่าน context.ui.choice.show()
    choice: {
      maxWidth: "min(720px, calc(100% - 32px))",
      gap: 10,
      bottomGap: 14,
      background: "rgba(255, 248, 230, 0.96)",
      borderColor: "#dfc08a",
      textColor: "#34415b",
      selectedColor: "#6757d8",
      radius: 22,
      itemMinWidth: 92
    },
    // GUI 2D ที่ติดตาม Object/ตำแหน่ง World แต่หันตรงเข้าหาหน้าจอเสมอ
    gizmo: {
      background: "rgba(29, 49, 86, 0.92)",
      borderColor: "rgba(255, 255, 255, 0.82)",
      textColor: "#ffffff",
      radius: 14,
      fontSize: 14,
      safeMargin: 14,
      maxVisible: 24
    },
    // ข้อความผลลัพธ์สั้น ๆ แบบไม่บล็อกหน้าจอ เช่น สำเร็จ/คำเตือน/ผิดพลาด
    feedback: {
      background: "rgba(37, 55, 91, 0.94)", borderColor: "rgba(255, 255, 255, 0.76)",
      textColor: "#ffffff", radius: 18, maxWidth: "min(340px, calc(100% - 28px))", duration: 2600
    },
    // Popup มาตรฐานของบทเรียน รองรับข้อความ ปุ่มยืนยัน และหัวข้อย่อย
    dialog: {
      background: "linear-gradient(145deg, #ffffff, #f2f5ff)", borderColor: "rgba(255, 255, 255, 0.82)",
      textColor: "#2e3e59", radius: 26, maxWidth: "min(520px, calc(100vw - 28px))"
    },
    // เมนูปุ่ม utility ของกิจกรรม — เลือก position: top-right, middle-right หรือ bottom-right ตอนเรียกใช้
    control: {
      background: "rgba(255, 255, 255, 0.84)", borderColor: "rgba(255, 255, 255, 0.74)",
      textColor: "#45536e", radius: 18, edge: 14,
      buttonBackground: "linear-gradient(145deg, #f5f2ff, #eaf6ff)", buttonHover: "#e8e1ff", buttonRadius: 12
    },
    // Hint ใช้กล่องคำพูดและ responsive behavior จาก mascot กลาง
    hint: {
      defaultTitle: "คำแนะนำ", defaultType: "hint", duration: 0,
      backgroundStart: "rgba(46, 44, 86, 0.94)", backgroundEnd: "rgba(49, 83, 119, 0.91)",
      borderColor: "rgba(255, 255, 255, 0.78)", textColor: "#ffffff", secondaryTextColor: "rgba(255, 255, 255, 0.8)", radius: 24,
      feltBackground: "#174f82", feltBorderColor: "#d5a65f"
    },
    // Overlay ระหว่างรอ async task ของบทเรียน โดยยังคงเปิดปุ่ม Back บน Topbar ได้
    busy: {
      background: "rgba(222, 244, 255, 0.42)", cardBackground: "rgba(255, 255, 255, 0.94)",
      textColor: "#33435f", radius: 24
    },
    // แผงควบคุมกล้องมุมขวาล่างของระบบ ไม่ใช่ context.ui.control และซ่อนบนมือถือ
    cameraControls: {
      background: "rgba(255, 255, 255, 0.78)", borderColor: "rgba(255, 255, 255, 0.75)",
      buttonBackground: "#edf6fb", buttonColor: "#50647c", resetBackground: "#7668d8",
      radius: 18, buttonRadius: 11, right: 14, bottom: 14,
      feltBackground: "#fff2d6", feltBorderColor: "#dfc08a", feltButtonBackground: "#fff8e8"
    },
    // ข้อความช่วยแบบเก่ามุมซ้ายล่าง ระบบเติมข้อความจาก lesson meta.tooltip และซ่อนบน Mobile
    worldHint: {
      background: "rgba(255, 255, 255, 0.80)", borderColor: "rgba(255, 255, 255, 0.75)",
      textColor: "#647891", radius: 16, left: 14, bottom: 15, maxWidth: "34vw", fontSize: 11
    },
    // ป้ายคำอธิบายใน world-space: ปรับสีพื้น ตัวอักษร เส้นชี้ และความโปร่งใสได้จากจุดนี้
    // ใช้ชี้ "พื้นที่" ในฉากผ่าน world.addCallout(); ไม่ใช่ระบบเดียวกับ ui.gizmo
    worldCallout: {
      backgroundStart: "#041b3f", backgroundEnd: "#3c0881", backgroundOpacity: 0.94,
      fontColor: "#ffffff", borderColor: "rgba(19, 33, 188, 0.56)",
      lineColor: "#4689bc", lineOpacity: 0.92, targetColor: "#ffe079",
      // ขนาด GUI บนหน้าจอ (px) — scale ที่ lesson ส่งมาจะคูณต่อจากค่านี้เล็กน้อย
      desktop: { width: 136, height: 40, fontSize: 12 },
      mobile: { width: 138, height: 40, fontSize: 11 },
      // Actionable Callout: มี icon i เด้งเบา ๆ และขยาย/เรืองแสงเมื่อ hover
      actionBorderColor: "#ffe69a", actionGlowColor: "#ffd568",
      actionIconBackgroundStart: "rgba(255,255,255,0.08)", actionIconBackgroundEnd: "rgba(255,255,255,0.16)",
      actionIconBorderColor: "rgba(255,255,255,0.92)", actionIconColor: "#ffffff",
      actionIconHoverBackgroundStart: "rgba(255,183,77,0.16)", actionIconHoverBackgroundEnd: "rgba(255,139,43,0.28)",
      actionIconHoverBorderColor: "#ffbd66", actionIconHoverColor: "#ff9b38", actionIconHoverScale: 1.14,
      actionIconSize: 18, actionIconFontSize: 12, actionIconOpacity: 0.96,
      actionHoverScale: 1.035, actionHoverGlow: 0.3, actionIdlePulse: 0.006, actionPulseSpeed: 0.0018,
      actionIconBobHeight: 1, actionIconBobDuration: 2200
    },
    // ตัวเลขดิจิตอลแบบ 3D สำหรับนับจำนวนบนพื้นที่โจทย์/คำตอบ (world-space, ไม่รับ interaction)
    worldCounter: {
      baseColor: "#6b9b55", edgeColor: "#527a48", faceColor: "#f3f1cf",
      digitColor: "#315d35", digitEmissive: "#173a1f", digitEmissiveIntensity: 0.16,
      digitWidth: 0.58, digitDepth: 0.82, digitSpacing: 0.76,
      segmentThickness: 0.095, segmentHeight: 0.08,
      paddingX: 0.42, paddingZ: 0.28, baseHeight: 0.16, faceHeight: 0.08,
      roughness: 0.62, clearcoat: 0.22, maxDigits: 6, mobileScale: 1.12
    },
    // World GUI: ป้ายข้อความมาตรฐานที่วางราบบนพื้นและไม่หันตามกล้อง
    // บทเรียนทั่วไปส่งเพียง world.addWorldGui({ text: "..." }) แล้วใช้ค่าชุดนี้ร่วมกัน
    worldGui: {
      // ตำแหน่งเดียวกันสำหรับทุกขนาดจอ แนะนำให้ปรับครั้งละประมาณ 0.1–0.3
      position: {
        x: 0,    // ซ้าย(-) / ขวา(+)
        y: 0.18, // ต่ำ(-) / สูง(+) — ปกติไม่ต้องปรับ
        z: 6.3  // ด้านหลัง(-) / ด้านหน้า(+)
      },

      size: [3.6, 0.95],       // [ความกว้าง, ความลึก] ของกรอบบนพื้น (หน่วย World)
      textColor: "#ffffff",   // สีตัวหนังสือ
      fontSize: 150,           // ขนาดตัวหนังสือ แนะนำประมาณ 120–180
      borderColor: "#ffffff", // สีเส้นกรอบแคปซูล
      backgroundColor: "#000000", // สีพื้นด้านในกรอบ
      backgroundOpacity: 0.35,   // ความทึบพื้นหลัง: 0 = โปร่งใส, 1 = ทึบเต็ม

      // ใช้เฉพาะ worldGui ที่มี insight หรือ onClick ให้ดูเหมือนปุ่มนูนและรู้ว่ากดได้
      actionable: {
        faceColor: "#fffdf4",          // สีหน้าปุ่ม 3D ในสถานะปกติ
        edgeColor: "#6756c9",          // สีฐาน/ขอบล่างของปุ่ม
        hoverFaceColor: "#ffffff",     // สีหน้าปุ่มเมื่อชี้เมาส์
        hoverEdgeColor: "#ffad32",     // สีขอบเมื่อชี้เมาส์
        emissiveColor: "#fff3bf",      // แสงอ่อนบนหน้าปุ่ม
        faceHeight: 0.10,               // ความหนาของแผ่นหน้าปุ่ม
        baseHeight: 0.16,               // ความหนาของฐาน 3D
        outerPadding: 0.08,             // ระยะฐานที่ยื่นพ้นกรอบข้อความ
        hoverLift: 0.045,               // ระยะยกขึ้นเมื่อ Hover
        roughness: 0.34,
        clearcoat: 0.82,
        backgroundColor: "#fffdf4",    // สีพื้น Canvas ด้านบน
        hoverBackgroundColor: "#fff7d6",
        backgroundOpacity: 0.98,
        borderColor: "#6756c9",
        hoverBorderColor: "#ffad32",
        borderWidth: 22,
        iconSize: 128,
        iconBackground: "#6756c9",
        hoverIconBackground: "#ff9f1f",
        iconColor: "#ffffff",
        iconBorderColor: "#ffffff",
        iconBorderWidth: 7,
        iconText: "i"
      }
    },
    animation: { optionDuration: 420, typewriterSpeed: 16, serviceExitDuration: 180 }
  }
};
