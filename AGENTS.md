<!-- BEGIN:fe-agent-rules -->

# InviteMe Frontend (invite-me-fe) - Developer & Agent Guidelines

## 1. Core Stack & Architecture

- **Framework:** Next.js 14+ (App Router), TypeScript (Strict Mode), Material UI (MUI v5).
- **Design System Source of Truth:** `@/constants/style.constant.ts` (COLOR, SPACING, RADIUS, SHADOW, ANIMATION, FONT_SIZE, FONT_WEIGHT, LETTER_SPACING, FONT_FAMILY).
- **Shared Components:** `@/components/shared` (`StackRowAlignJustCenter`, `StackRowAlignJustBetween`, `StackCol`, `StackCenter`, `HeadingElement`, `TextElement`, `ButtonElement`, `IconElement`, etc.).

---

## 2. Layout & Spacing Rules (Strict Production Standard)

### No-Hardcoded-Flex Rule:
- **NEVER** write manual inline flex CSS (`display: "flex"`, `flexDirection: ...`, `alignItems: ...`, `justifyContent: ...`) directly in `sx={{ ... }}` unless building a low-level base wrapper.
- **ALWAYS use custom Stacks** from `@/components/shared`:
  - `StackRow`, `StackRowAlignJustCenter`, `StackRowAlignJustBetween`, `StackRowAlignJustStart`, `StackRowAlignJustEnd`, `StackRowWrap`.
  - `StackCol`, `StackColAlignJustCenter`, `StackColAlignJustBetween`, `StackColAlignJustStart`, `StackColAlignJustEnd`.
  - `StackCenter`.
- For non-Stack elements (e.g. `Paper`, `Box` wrappers), use shared SX helpers (`PANEL_RAIL_SX`, `PANEL_CONTENT_SX`, `CARD_ITEM_SX`, `SELECTABLE_ITEM_SX`) or layout tokens.

### 4px Base Grid & SPACING Rule:
- **NEVER** hardcode raw spacing numbers (`p: 3.5`, `py: 8`, `gap: 2`, `mb: 5`, `px: 3`) in `sx` props.
- **ALWAYS** use semantic `SPACING` tokens from `@/constants/style.constant.ts`:
  - `SPACING.px2` (0.25 = 2px), `SPACING.px4` (0.5 = 4px), `SPACING.px6` (0.75 = 6px)
  - `SPACING.px8` (1 = 8px), `SPACING.px12` (1.5 = 12px), `SPACING.px16` (2 = 16px)
  - `SPACING.px20` (2.5 = 20px), `SPACING.px24` (3 = 24px), `SPACING.px28` (3.5 = 28px)
  - `SPACING.px32` (4 = 32px), `SPACING.px40` (5 = 40px), `SPACING.px48` (6 = 48px)
  - `SPACING.px64` (8 = 64px), `SPACING.px80` (10 = 80px), `SPACING.px96` (12 = 96px)
  - `SPACING.px104` (13 = 104px), `SPACING.px128` (16 = 128px)

---

## 3. Color & Token System

### No-Hardcoded-Colors Rule:
- **NEVER** use raw hex codes (e.g., `#FFFFFF`, `#FAF9F6`, `#ECE7DD`, `#B78628`, `#3B1117`) or arbitrary rgba strings directly in components.
- **ALWAYS** use `COLOR` tokens from `@/constants/style.constant.ts`:
  - Backgrounds: `COLOR.bgPrimary`, `COLOR.bgSecondary`, `COLOR.bgTertiary`, `COLOR.bgPaper`, `COLOR.bgDark`, `COLOR.bgDarkPaper`
  - Text: `COLOR.textPrimary`, `COLOR.textSecondary`, `COLOR.textTertiary`, `COLOR.textGold`, `COLOR.textInverse`
  - Borders: `COLOR.borderGold`, `COLOR.borderGoldLight`, `COLOR.borderSecondary`, `COLOR.borderSubtle`, `COLOR.divider`
  - Brand Palette: `COLOR.gold.*` (main: `#B78628`), `COLOR.rose.*`
  - Status: `COLOR.status.success`, `COLOR.status.error`, `COLOR.status.warning`, `COLOR.status.info`
  - Buttons: `COLOR.btnPrimary`, `COLOR.btnSecondary`, `COLOR.btnGradient`

---

## 4. Typography & Radius Rules

### No-Hardcoded-Typography Rule:
- Use `FONT_SIZE` tokens (`xs`, `sm`, `md`/`base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`).
- Use `FONT_WEIGHT` tokens (`light`, `regular`, `medium`, `semibold`, `bold`, `extrabold`, `black`).
- Use `LETTER_SPACING` tokens (`tight`, `normal`, `wide`, `wider`, `widest`, `mega`).
- Use `FONT_FAMILY` tokens (`sans`, `serif`, `script`, `vietnamese`).

### Radius & Shadow Rules:
- Use `RADIUS` tokens (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`).
- Use `SHADOW` tokens (`sm`, `md`, `lg`, `xl`, `none`).
- Use `ANIMATION` tokens (`sm`, `md`, `lg`, `xl`, `none`).

---

## 5. Code Quality & Clean Code Standards

- **Clean Architecture:** Tách logic dữ liệu mảng lớn / preset cấu hình tĩnh ra khỏi render JSX (đặt ở đầu file hoặc file constant riêng).
- **Zero Errors:** Mọi thay đổi đều phải vượt qua `npm run lint` và `npx tsc --noEmit` với **0 errors, 0 warnings**.
- **DRY Style Objects:** Khi các item card / list lặp lại style trong feature module, đặt vào `[feature].styles.ts` (ví dụ: `canvas-editor.styles.ts`) thay vì nhồi nhét vào global constant.

<!-- END:fe-agent-rules -->
