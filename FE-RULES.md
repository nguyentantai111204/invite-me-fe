# 🛠 FRONTEND ENGINEERING RULES & CONVENTIONS

> **Dự án:** Card Editor
> **Core Stack:** Next.js (App Router), React, Material UI (MUI v5), Redux Toolkit, React-Konva, TypeScript.

---

## 1. 📁 NAMING CONVENTIONS & ARCHITECTURE

- **Tên file và thư mục:** Bắt buộc dùng `kebab-case` (chữ thường, cách nhau bằng dấu gạch ngang).
  - ✅ Tốt: `image-layer.tsx`, `use-drag-drop.ts`
  - ❌ Xấu: `ImageLayer.tsx`, `useDragDrop.ts`
- **Tên React Component / Interface:** Dùng `PascalCase`.
  - Ví dụ: `export const RightPanel = () => {}`, `interface ICardLayer {}`
- **Tên biến, hàm, hook:** Dùng `camelCase`.
  - Ví dụ: `const isSidebarOpen = true;`, `const handleExportCard = () => {}`
- **Hằng số (Constants):** Dùng `UPPER_SNAKE_CASE` và lưu trong file riêng.
  - Ví dụ: `MAX_CANVAS_WIDTH = 1920;`
- **Cấu trúc App Router:** Tách biệt rõ ràng layout giữa `(dashboard)` (có Header/Sidebar) và `editor/` (Full-screen viewport).

---

## 2. 🛡️ TYPESCRIPT STRICTNESS

Tuyệt đối KHÔNG viết TypeScript theo kiểu "chống đối" để code chạy giống JavaScript.

- **Banned `any`:** Bắt buộc không sử dụng `any`. Dùng `unknown` và type-checking nếu chưa xác định được kiểu dữ liệu.
- **Banned `@ts-ignore`:** Nghiêm cấm dùng để tắt cảnh báo. Nếu thư viện bên thứ 3 lỗi type, dùng `@ts-expect-error` và **phải kèm comment giải thích** phía trên.
- **Explicit Return Types:** Mọi Custom Hook và Utility Function đều phải khai báo kiểu trả về (Return Type). React Component có thể để TS tự suy luận.
- **Interface vs Type:** Ưu tiên dùng `interface` cho Object/Model để dễ `extends`. Chỉ dùng `type` cho Union types (VD: `type Size = 'sm' | 'md' | 'lg'`).

---

## 3. 🏗️ BASE INTERFACES (CẤU TRÚC DỮ LIỆU CỐT LÕI)

Các interface base đặt trong `src/types/`. Mọi model phải kế thừa từ đây.

### 3.1. API Base (`types/api.d.ts`)

```typescript
export interface IBaseResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
```

### 3.2. Editor Base (`types/editor.d.ts`)

```typescript
export type LayerType = "text" | "image" | "sticker" | "shape";

export interface ILayerBase {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  zIndex: number;
  isLocked: boolean;
  isHidden: boolean;
}

export interface ITextLayer extends ILayerBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  textAlign: "left" | "center" | "right";
}
```

---

## 4. 🎨 STYLING RULES (STRICTLY MATERIAL UI)

Sử dụng 100% Material UI (MUI). Tuyệt đối KHÔNG dùng Tailwind, Bootstrap hay CSS thuần để tránh conflict.

- **Ít style:** Viết trực tiếp bằng prop `sx` vào file `.tsx`.
- **Nhiều style:** Tạo file `.styles.ts` nằm cùng cấp. Dùng `styled()` API hoặc export object `sx`.

Ví dụ cấu trúc Component:

```plaintext
components/header/
├── index.ts             # Export Component
├── header.tsx           # Chứa UI & Logic
└── header.styles.ts     # Khai báo styled components
```

---

## 5. 🗄️ STATE MANAGEMENT & API CALLING

- **Client State (Redux Toolkit):** Quản lý cấu trúc dữ liệu JSON của Canvas (layer, tọa độ, z-index) và lịch sử thao tác (Undo/Redo).
- **Server State (SWR):** Dùng SWR để fetch, cache dữ liệu từ Server (template, profile). Không lưu data này vào Redux trừ khi cần sửa trực tiếp trong Editor.
- **Local State (useState):** Giới hạn cho UI tạm thời (Đóng/mở Dialog, trạng thái Hover).
- **Axios:** File `axios-instance.ts` bắt buộc cấu hình Interceptor để tự động đính kèm JWT Token và xử lý Refresh Token khi lỗi 401.

---

## 6. ⚙️ UTILITIES & CUSTOM HOOKS

- **Pure Functions (Utils):** File trong `src/utils/` tuyệt đối không có side-effects (Không gọi API, không DOM, không LocalStorage).

```typescript
export const clampPosition = (
  value: number,
  min: number,
  max: number,
): number => {
  return Math.max(min, Math.min(max, value));
};
```

- **Hooks:** Chỉ dùng bọc logic (`useKeyPress`, `useHistoryUndo`). Bắt buộc phải có cleanup function (`removeEventListener`) trong `useEffect` để tránh rò rỉ bộ nhớ.

---

## 7. 🎨 CANVAS & EDITOR RULES (REACT-KONVA)

- **Tách biệt Layer:** Mỗi đối tượng (Chữ, Hình, Sticker) phải là một Component riêng (VD: `TextLayer.tsx`).
- **Tối ưu Re-render:** Dùng `React.memo` cho các Layer Component và `useCallback` cho các hàm sự kiện kéo thả.
- **Logic toán học:** Mọi logic tính scale, zoom, bound, collision phải đặt ngoài Component và import từ `utils/canvas-helpers.ts`.

---

## 8. 🚨 ERROR HANDLING

- **API Errors:** Mọi API mutate (POST, PUT, DELETE) phải bọc `try/catch` và thông báo qua Toast/Snackbar (MUI). Không dùng `alert()`.
- **Canvas Crash:** Bắt buộc bọc khu vực Editor bằng `<ErrorBoundary>`. Nếu Konva crash, hiện màn hình lỗi thân thiện thay vì làm trắng toàn bộ trang web.
