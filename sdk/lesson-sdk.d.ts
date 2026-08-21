export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type LessonMode = "teacher-lab" | "student-lab" | "student-quiz";
export type DragAxis = "xz" | "xy";
export type PrimitiveShape = "box" | "sphere" | "cylinder" | "cone" | "torus" | "circle" | "plane";

export interface DropPosition { x: number; y: number; z: number }
export type DropResult = boolean | { accepted?: boolean; commit?: boolean } | void;

export interface LessonHandle {
  /** Opaque scene reference. Use primarily as addGuideline.fromObject. */
  readonly object3D: unknown;
  setPosition(x: number, y: number, z: number): void;
  setRotation(x?: number, y?: number, z?: number): void;
  setScale(x?: number, y?: number, z?: number): void;
  animateTo(x: number, y: number, z: number, options?: { duration?: number; delay?: number; arcHeight?: number }): void;
  stopAnimation(): void;
  playCommit(): void;
  setColor(color: string | number): void;
  setVisible(value: boolean): void;
  setDraggable(value: boolean): void;
  setClickable(value: boolean): void;
  remove(): void;
}

export interface LessonMaterialOptions {
  color?: string | number;
  opacity?: number;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string | number;
  emissiveIntensity?: number;
  texture?: string;
  depthWrite?: boolean;
}

export interface PrimitivePart {
  shape?: PrimitiveShape;
  size?: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  color?: string | number;
  material?: LessonMaterialOptions;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export interface LessonObjectOptions {
  name?: string;
  position?: Vec3;
  rotation?: Vec3;
  scale?: number | Vec3;
  draggable?: boolean;
  clickable?: boolean;
  dragAxis?: DragAxis;
  hoverMessage?: string;
  guideTarget?: Vec3 | null;
  onDrag?: (position: DropPosition) => void;
  onDrop?: (position: DropPosition, handle: LessonHandle) => DropResult;
  onClick?: (event: { handle: LessonHandle; object: unknown; hitPoint: DropPosition }) => void;
}

export interface OperatorHandle extends LessonHandle {
  pulse(): void;
  setState(valid: boolean): void;
}

export interface LessonWorld {
  clear(): void;
  readonly capabilities: {
    readonly version: string;
    readonly objects: readonly string[];
    readonly interactions: readonly string[];
    readonly modelFormats: readonly string[];
  };
  readonly assets: LessonAssetLibrary;
  addPrimitive(options?: LessonObjectOptions & PrimitivePart): LessonHandle;
  addGroup(options?: LessonObjectOptions & { parts?: PrimitivePart[]; children?: PrimitivePart[] }): LessonHandle;
  addText3D(options?: LessonObjectOptions & {
    text?: string | number;
    size?: Vec2;
    color?: string;
    background?: string;
    fontSize?: number;
    fontWeight?: number;
    depthTest?: boolean;
  }): LessonHandle;
  addLibraryObject(options: LessonObjectOptions & { asset: string; color?: string | number }): LessonHandle;
  addObject(options: LessonObjectOptions & Record<string, unknown>): LessonHandle;
  addBox(options?: {
    name?: string;
    size?: Vec3;
    position?: Vec3;
    color?: string | number;
    draggable?: boolean;
    dragAxis?: DragAxis;
    hoverMessage?: string;
    guideTarget?: Vec3 | null;
    onDrag?: (position: DropPosition) => void;
    onDrop?: (position: DropPosition, handle: LessonHandle) => DropResult;
  }): LessonHandle;
  addZone(options?: { name?: string; size?: Vec3; position?: Vec3; color?: string | number; opacity?: number }): LessonHandle;
  addCallout(options?: { text?: string; position?: Vec3; anchor?: Vec3; color?: string | number; lineColor?: string | number; scale?: Vec2 }): LessonHandle;
  addLabel(options?: { text?: string; position?: Vec3; anchor?: Vec3; color?: string | number; lineColor?: string | number; scale?: Vec2 }): LessonHandle;
  addOperatorSign(options?: { text?: "<" | ">" | "="; position?: Vec3; scale?: Vec2 }): OperatorHandle;
  addGuideline(options?: { from?: Vec3; fromObject?: unknown; to?: Vec3; color?: string | number }): LessonHandle;
  addTargetFocus(options?: { position?: Vec3; radius?: number; color?: string | number; secondaryColor?: string | number }): LessonHandle;
  showDragCue(handle: LessonHandle, to: Vec3): void;
  hideDragCue(): void;
  playEntrance(): void;
  getObject(name: string): unknown;
  readonly camera: {
    reset(): void;
    configure(options?: CameraOptions): void;
  };
}

export interface LessonAssetInfo {
  id: string;
  name: string;
  type: string;
  tags: string[];
}

export interface LessonAssetLibrary {
  readonly version: string;
  list(): LessonAssetInfo[];
  get(id: string): Readonly<Record<string, unknown>>;
}

export interface CameraOptions {
  fov?: number;
  startYaw?: number;
  startPitch?: number;
  startDistance?: number;
  minDistance?: number;
  maxDistance?: number;
  minPitch?: number;
  maxPitch?: number;
  target?: Vec3;
}

export interface EditSchemaItem {
  key: string;
  name: string;
  type: "slider" | "dropdown";
  option: [number, number] | Array<string | number>;
  step?: number;
}

export interface HowToStep {
  index: number;
  title: string;
  type: "sequence" | "freestyle";
  desc: string;
}

export interface QuizQuestion {
  question: string;
  data: Array<{ key: string; value: unknown }>;
}

export interface LessonMeta {
  worldType: "3d-world-space";
  lessonId: string;
  description: string;
  keyResult: string;
  background?: string;
  camera?: CameraOptions;
  welcomeMessage?: string[];
  tooltip?: string;
  defaultValue: Record<string, unknown>;
  editSchema: EditSchemaItem[];
  howto: HowToStep[];
  quiz: QuizQuestion[];
}

export interface LessonContext {
  readonly world: LessonWorld;
  readonly assets: LessonAssetLibrary;
  readonly capabilities: LessonWorld["capabilities"];
  readonly ui: {
    toast(message: string, type?: string): void;
    setObjective(message: string): void;
    setProgress(current: number, total: number): void;
  };
  readonly audio: { play(name: string): void };
  readonly root: HTMLElement;
  readonly lessonData: Readonly<Record<string, unknown>>;
  readonly mode: LessonMode;
  readonly language: string;
  objectiveAction(): void;
  readonly quiz: { answer(correct: boolean, details?: Record<string, unknown>): boolean };
  complete(result?: Record<string, unknown>): void;
}

export interface LessonResetPayload {
  values: Record<string, unknown>;
  mode: LessonMode;
  question?: QuizQuestion;
  questionIndex?: number;
}

export interface LessonDefinition {
  id: string;
  version: string;
  meta: LessonMeta;
  mount(context: LessonContext): void | Promise<void>;
  reset(payload: LessonResetPayload): void | Promise<void>;
  onStep(index: number, step: HowToStep): void | Promise<void>;
  dispose(): void | Promise<void>;
}

declare global {
  const PuzzleLesson: {
    define(definition: LessonDefinition): void;
  };
}
