src/
├── app/ # Next.js App Router (Routing chính)
│ ├── (marketing)/ # Group: Các trang không cần đăng nhập
│ │ ├── page.tsx # Trang chủ giới thiệu
│ │ └── about/page.tsx
│ ├── (dashboard)/ # Group: Quản lý thiệp sau khi đăng nhập
│ │ ├── my-cards/page.tsx # Danh sách thiệp đã thiết kế
│ │ └── layout.tsx # Layout có sidebar navigation
│ ├── editor/ # ⚡ KHU VỰC QUAN TRỌNG NHẤT: Trình thiết kế
│ │ ├── [card-id]/page.tsx # Trang editor cho 1 thiệp cụ thể
│ │ └── layout.tsx # Layout full-màn hình, không có footer/header thừa
│ ├── layout.tsx # Root layout (chứa Provider, Font)
│ └── globals.css # Tailwind base
│
├── components/ # Chứa tất cả React Components
│ ├── ui/ # Các UI dùng chung (Buttons, Inputs, Modals - Radix/Shadcn)
│ │ ├── primary-button.tsx
│ │ └── color-picker.tsx
│ │
│ ├── editor/ # ⚡ CÁC COMPONENT ĐỘC QUYỀN CHO EDITOR
│ │ ├── canvas-area/ # Khu vực vẽ chính (React-Konva)
│ │ │ ├── main-stage.tsx # Thẻ <Stage> bọc ngoài cùng
│ │ │ ├── text-layer.tsx # Component render chữ
│ │ │ └── image-layer.tsx # Component render hình/sticker
│ │ ├── left-panel/ # Thanh công cụ bên trái
│ │ │ ├── asset-library.tsx # Kho hình ảnh, sticker
│ │ │ └── text-presets.tsx # Các mẫu chữ có sẵn
│ │ ├── right-panel/ # Thanh thuộc tính bên phải (Settings)
│ │ │ ├── layer-manager.tsx # Quản lý thứ tự layer (Z-index)
│ │ │ └── property-editor.tsx # Đổi màu, font, kích thước cho item đang chọn
│ │ └── top-toolbar/ # Thanh công cụ trên cùng
│ │ ├── undo-redo.tsx
│ │ └── export-button.tsx
│ │
│ └── shared/ # Các component dùng chung cho toàn app (Header, Footer)
│ └── main-navigation.tsx
│
├── store/ # ⚡ QUẢN LÝ STATE (Redux Toolkit)
│ ├── store.ts # File config store chính
│ ├── editor-slice.ts # Lưu trữ mảng layers, phần tử đang chọn (selectedId)
│ ├── history-slice.ts # Xử lý mảng history cho tính năng Undo/Redo
│ └── user-slice.ts # Quản lý thông tin user
│
├── hooks/ # Custom React Hooks
│ ├── use-drag-and-drop.ts # Hook xử lý logic thả item từ left-panel vào canvas
│ ├── use-canvas-history.ts # Hook bọc logic Undo/Redo (Ctrl+Z, Ctrl+Y)
│ └── use-keyboard-shortcuts.ts # Bắt sự kiện phím (Delete, Copy, Paste)
│
├── types/ # TypeScript Definitions (Rất quan trọng để code clean)
│ ├── canvas-elements.d.ts # Định nghĩa interface: TextElement, ImageElement
│ ├── editor-state.d.ts # Định nghĩa cấu trúc State
│ └── database.d.ts # Định nghĩa dữ liệu trả về từ API
│
├── utils/ # Helper functions (Không chứa React logic)
│ ├── canvas-helpers.ts # Tính toán tọa độ scale, zoom
│ ├── export-image.ts # Hàm chuyển Canvas ra file PNG/JPG
│ └── generate-id.ts # Tạo ID ngẫu nhiên cho layer mới
│
├── constants/ # Các giá trị cố định
│ ├── editor-config.ts # Các size chuẩn (A4, Story IG, Vuông)
│ └── default-fonts.ts # Danh sách font hỗ trợ
│
└── assets/ # Tài nguyên tĩnh
├── sounds/ # Nhạc nền thiệp
├── lottie/ # File JSON animation (.json)
└── stickers/ # Bộ sưu tập hình ảnh trang trí
