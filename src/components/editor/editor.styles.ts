import { COLOR, RADIUS, ANIMATION, SPACING } from "@/constants/style.constant";
import { STACK_CENTER } from "@/components/shared";

export const CARD_ITEM_SX = {
  cursor: "pointer",
  borderRadius: RADIUS.md,
  border: `1px solid ${COLOR.bgTertiary}`,
  backgroundColor: COLOR.bgSecondary,
  transition: ANIMATION.sm,
  "&:hover": {
    backgroundColor: COLOR.bgPaper,
    borderColor: COLOR.gold.main,
  },
} as const;

export const SELECTABLE_ITEM_SX = (isSelected: boolean) => ({
  cursor: "pointer",
  borderRadius: RADIUS.md,
  border: `1.5px solid ${isSelected ? COLOR.gold.main : COLOR.bgTertiary}`,
  backgroundColor: isSelected ? COLOR.bgTertiary : COLOR.bgSecondary,
  transition: ANIMATION.sm,
  boxShadow: isSelected ? `0 2px 10px ${COLOR.gold.main}1F` : "none",
  "&:hover": {
    backgroundColor: COLOR.bgPaper,
    borderColor: COLOR.gold.main,
  },
} as const);

export const PANEL_RAIL_SX = {
  height: "100%",
  backgroundColor: COLOR.bgSecondary,
  borderRight: `1px solid ${COLOR.borderGoldLight}`,
  ...STACK_CENTER,
  flexDirection: "column" as const,
  py: SPACING.px16,
  gap: SPACING.px8,
  flexShrink: 0,
} as const;

export const PANEL_CONTENT_SX = {
  height: "100%",
  backgroundColor: COLOR.bgPaper,
  borderRight: `1px solid ${COLOR.borderGoldLight}`,
  display: "flex",
  flexDirection: "column" as const,
  overflowY: "auto" as const,
  overflowX: "hidden" as const,
  flexShrink: 0,
  "&::-webkit-scrollbar": { width: "4px" },
  "&::-webkit-scrollbar-thumb": {
    background: COLOR.borderSubtle,
    borderRadius: RADIUS.xs,
  },
} as const;
