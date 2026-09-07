export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type LessonMode = "teacher-lab" | "student-lab" | "student-quiz";
export type DragAxis = "xz" | "xy";
export type PrimitiveShape = "box" | "sphere" | "cylinder" | "cone" | "torus" | "circle" | "plane";
export type GuiScope = "lesson" | "scene" | "step" | "question" | "manual";
export type GuiTone = "default" | "primary" | "info" | "success" | "warning" | "error";

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
  /** เพิ่ม/ลบ hit area ที่มองไม่เห็น โดยไม่เปลี่ยนขนาดโมเดลจริง */
  setHitArea(size?: Vec3 | null, offset?: Vec3): void;
  /** true ทำให้จุดจับกระโดดมาอยู่กลางวัตถุ เหมาะกับ source hit area ขนาดใหญ่ */
  setDragFromCenter(value: boolean): void;
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
  outlineMode?: "all" | "primary" | "none";
  draggable?: boolean;
  clickable?: boolean;
  /** Set false when click runs a custom group effect and must not show the platform hover/select marker. */
  selectionFeedback?: boolean;
  dragAxis?: DragAxis;
  /** Optional extra lift while dragging an object that starts partly below a surface. */
  dragLiftHeight?: number;
  /** Invisible interaction bounds; useful when the visible model is too small to touch. */
  hitArea?: Vec3;
  hitAreaOffset?: Vec3;
  dragFromCenter?: boolean;
  objectiveAction?: boolean;
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

export interface WorldCounterHandle extends LessonHandle {
  readonly digits: number;
  setValue(value: number): number;
  getValue(): number;
}

export interface WorldGuiHandle extends LessonHandle {
  setText(text: string): string;
  getText(): string;
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
  addConnector(options?: { name?: string; from?: Vec3; to?: Vec3; color?: string | number; thickness?: number; opacity?: number }): LessonHandle;
  addText3D(options?: LessonObjectOptions & {
    text?: string | number;
    size?: Vec2;
    color?: string;
    background?: string;
    fontSize?: number;
    fontWeight?: number;
    depthTest?: boolean;
  }): LessonHandle;
  addLibraryObject(options: LessonObjectOptions & { asset: string; color?: string | number; targetSize?: number; normalize?: boolean }): LessonHandle | Promise<LessonHandle>;
  addObject(options: LessonObjectOptions & Record<string, unknown>): LessonHandle | Promise<LessonHandle>;
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
  addCallout(options?: { text?: string; position?: Vec3; compactPosition?: Vec3; anchor?: Vec3; color?: string | number; lineColor?: string | number; scale?: Vec2; compactScale?: Vec2; insight?: InsightOptions | string | ((event: { handle: LessonHandle; object: unknown; hitPoint: DropPosition }) => InsightOptions | string | void); onClick?: LessonObjectOptions["onClick"]; objectiveAction?: boolean }): LessonHandle;
  addLabel(options?: { text?: string; position?: Vec3; compactPosition?: Vec3; anchor?: Vec3; color?: string | number; lineColor?: string | number; scale?: Vec2; compactScale?: Vec2; insight?: InsightOptions | string | (() => InsightOptions | string | void); onClick?: LessonObjectOptions["onClick"] }): LessonHandle;
  addWorldCounter(options?: {
    name?: string; position?: Vec3; compactPosition?: Vec3; rotation?: Vec3; scale?: number | Vec3; compactScale?: number | Vec3;
    value?: number; digits?: number; leadingZero?: boolean; digitSpacing?: number;
    edgeColor?: string | number; baseColor?: string | number; faceColor?: string | number; digitColor?: string | number; digitEmissive?: string | number;
  }): WorldCounterHandle;
  addWorldGui(options?: {
    name?: string; position?: Vec3; compactPosition?: Vec3; rotation?: Vec3; scale?: number | Vec3; compactScale?: number | Vec3;
    text?: string; size?: Vec2; maxLines?: number; fontSize?: number; fontWeight?: number;
    textColor?: string; backgroundColor?: string | number; borderColor?: string | number; accentColor?: string;
  }): WorldGuiHandle;
  addOperatorSign(options?: { text?: "<" | ">" | "=" | "+" | "-" | "−" | "×" | "÷"; position?: Vec3; scale?: Vec2 }): OperatorHandle;
  addGuideline(options?: { from?: Vec3; fromObject?: unknown; to?: Vec3; color?: string | number }): LessonHandle;
  addTargetFocus(options?: { position?: Vec3; radius?: number; color?: string | number; opacity?: number; animate?: boolean; rotateSpeed?: number; pulseScale?: number; opacityPulse?: number }): LessonHandle;
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
  option: [number, number] | Array<string | number | { value: string | number; label: string }>;
  step?: number;
  help?: string;
  showWhen?: { key: string; value?: string | number; values?: Array<string | number> };
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
  title: string;
  category: string;
  subcategory: string;
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

export interface GuiHandle {
  readonly id: string;
  readonly scope: GuiScope;
  update(options?: Record<string, unknown>): GuiHandle;
  show(): GuiHandle;
  hide(): GuiHandle;
  remove(): void;
}

export interface ChoiceItem {
  id?: string | number;
  value?: unknown;
  label: string;
  icon?: string;
  image?: string;
  disabled?: boolean;
}

export interface ChoiceHandle extends GuiHandle {
  readonly value: string | string[] | null;
  setItems(items: Array<ChoiceItem | string | number>): ChoiceHandle;
  setSelected(value: string | number | Array<string | number> | null): ChoiceHandle;
  setDisabled(value: string | number, disabled?: boolean): ChoiceHandle;
}

export interface GizmoHandle extends GuiHandle {
  setTarget(target: LessonHandle | unknown): GizmoHandle;
}

export interface ControlHandle extends GuiHandle {
  setItems(items: ChoiceItem[]): ControlHandle;
  setDisabled(value: string | number, disabled?: boolean): ControlHandle;
}

export interface DialogHandle {
  readonly id: string;
  readonly scope: GuiScope;
  update(options?: Partial<DialogOptions>): DialogHandle;
  close(reason?: string): void;
  remove(reason?: string): void;
}

export interface BusyHandle {
  readonly id: string;
  readonly scope: GuiScope;
  update(options?: Partial<BusyOptions>): BusyHandle;
  setProgress(value: number, message?: string): BusyHandle;
  hide(): void;
  remove(): void;
}

export interface DialogOptions {
  id?: string;
  scope?: GuiScope;
  title?: string;
  message?: string;
  icon?: string;
  tone?: GuiTone;
  primaryLabel?: string;
  secondaryLabel?: string;
  dismissible?: boolean;
  sections?: Array<{ title?: string; message?: string; text?: string }>;
  onPrimary?: (event: { id: string; action: "primary"; handle: DialogHandle }) => void;
  onSecondary?: (event: { id: string; action: "secondary"; handle: DialogHandle }) => void;
  onClose?: (event: { id: string; reason: string; handle: DialogHandle }) => void;
}

export interface InsightOptions extends Omit<DialogOptions, "sections"> {
  /** Safe rich content. Runtime allows only semantic tags and insight-* classes. */
  html?: string;
  contentHtml?: string;
  sections?: Array<{ title?: string; message?: string; text?: string }>;
}

export interface BusyOptions {
  id?: string;
  scope?: GuiScope;
  title?: string;
  message?: string;
  tone?: GuiTone;
  progress?: number;
}

export interface TopMessageOptions {
  id?: string;
  scope?: GuiScope;
  title?: string;
  message?: string;
  text?: string;
  icon?: string;
  tone?: GuiTone;
  duration?: number;
  dismissible?: boolean;
}

export interface ChoiceOptions {
  id?: string;
  scope?: GuiScope;
  title?: string;
  tone?: GuiTone;
  layout?: "auto" | "row" | "grid";
  selection?: "single" | "multiple";
  selected?: string | number | Array<string | number>;
  items: Array<ChoiceItem | string | number>;
  objectiveAction?: boolean;
  onSelect?: (event: { id: string; value: unknown; item: ChoiceItem; selected: string[]; handle: ChoiceHandle }) => void;
}

export interface LessonUi {
  readonly question: {
    show(options: string | { label?: string; text: string; tone?: GuiTone }): unknown;
    update(options: { label?: string; text?: string; tone?: GuiTone }): unknown;
    hide(): unknown;
    remove(): unknown;
  };
  readonly console: {
    set(options: string | { objective?: string; title?: string; message?: string; icon?: string; tone?: GuiTone; state?: GuiTone }): unknown;
    update(options: { objective?: string; title?: string; message?: string; icon?: string; tone?: GuiTone; state?: GuiTone }): unknown;
    feedback(message: string, options?: { tone?: GuiTone }): unknown;
    setObjective(message: string): unknown;
    reset(): unknown;
  };
  readonly topMessage: {
    show(options: TopMessageOptions | string): GuiHandle;
    success(message: string, options?: TopMessageOptions): GuiHandle;
    info(message: string, options?: TopMessageOptions): GuiHandle;
    warning(message: string, options?: TopMessageOptions): GuiHandle;
    error(message: string, options?: TopMessageOptions): GuiHandle;
    readonly current: GuiHandle | null;
    hide(): void;
  };
  readonly choice: {
    show(options: ChoiceOptions): ChoiceHandle;
    create(options: ChoiceOptions): ChoiceHandle;
    get(id: string): ChoiceHandle | null;
    clear(scope?: GuiScope): void;
  };
  readonly gizmo: {
    attach(target: LessonHandle | unknown, options?: GizmoOptions): GizmoHandle;
    at(position: Vec3, options?: GizmoOptions): GizmoHandle;
    get(id: string): GizmoHandle | null;
    clear(scope?: GuiScope): void;
  };
  readonly feedback: {
    show(options: string | { id?: string; scope?: GuiScope; title?: string; message?: string; text?: string; icon?: string; tone?: GuiTone; duration?: number; dismissible?: boolean }): GuiHandle;
    success(message: string, options?: Record<string, unknown>): GuiHandle;
    info(message: string, options?: Record<string, unknown>): GuiHandle;
    warning(message: string, options?: Record<string, unknown>): GuiHandle;
    error(message: string, options?: Record<string, unknown>): GuiHandle;
    get(id: string): GuiHandle | null;
    clear(scope?: GuiScope): void;
  };
  readonly dialog: {
    show(options: DialogOptions | string): DialogHandle;
    alert(message: string, options?: DialogOptions): DialogHandle;
    confirm(message: string, options?: DialogOptions): Promise<boolean>;
    get(id: string): DialogHandle | null;
    closeAll(): void;
  };
  readonly insight: {
    show(options: InsightOptions | string): DialogHandle;
    explain(options: InsightOptions | string): DialogHandle;
    get(id: string): DialogHandle | null;
    close(): void;
  };
  readonly control: {
    show(options: { id?: string; scope?: GuiScope; ariaLabel?: string; tone?: GuiTone; position?: "top-right" | "middle-right" | "bottom-right"; items: ChoiceItem[]; objectiveAction?: boolean; onAction?: (event: { id: string; value: unknown; item: ChoiceItem; handle: ControlHandle }) => void }): ControlHandle;
    create(options: Record<string, unknown>): ControlHandle;
    get(id: string): ControlHandle | null;
    clear(scope?: GuiScope): void;
  };
  readonly hint: {
    show(options: string | { id?: string; scope?: GuiScope; title?: string; header?: string; message?: string; text?: string; type?: "instruction" | "hint" | "optional"; duration?: number }): GuiHandle;
    get(id?: string): GuiHandle | null;
    hide(): void;
    clear(scope?: GuiScope): void;
  };
  readonly busy: {
    show(options?: BusyOptions | string): BusyHandle;
    readonly current: BusyHandle | null;
    hide(): void;
  };
  /** Compatibility API. Prefer question/console services in new lessons. */
  toast(message: string, type?: GuiTone): void;
  setObjective(message: string): void;
  setQuestion(message: string): void;
  clearQuestion(): void;
  setProgress(current: number, total: number): void;
}

export interface GizmoOptions {
  id?: string;
  scope?: GuiScope;
  type?: "label" | "badge" | "value" | "icon" | "image";
  text?: string;
  value?: string | number;
  icon?: string;
  image?: string;
  tone?: GuiTone;
  placement?: "top" | "bottom" | "left" | "right" | "center";
  worldOffset?: Vec3;
  offset?: Vec2;
  gap?: number;
  clamp?: boolean;
  priority?: number;
}

export interface LessonContext {
  readonly world: LessonWorld;
  readonly assets: LessonAssetLibrary;
  readonly capabilities: LessonWorld["capabilities"];
  readonly ui: LessonUi;
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
