"use client";

import React, { useState, useEffect } from "react";
import { Joyride, STATUS, Step, EventHandler } from "react-joyride";
import { COLOR, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOW } from "@/constants/style.constant";

const TOUR_STORAGE_KEY = "inviteme_editor_tour_seen";

interface IEditorOnboardingTourProps {
  run: boolean;
  onFinish?: () => void;
}

export const EditorOnboardingTour: React.FC<IEditorOnboardingTourProps> = ({ run, onFinish }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const steps: Step[] = [
    {
      target: '[data-tour="assets-drawer"]',
      title: "✨ 1. Kho Tài Nguyên & Hiệu Ứng",
      content: "Chèn mẫu chữ nghệ thuật, hoa lá sticker, khung hình, tải ảnh cưới của bạn và chọn hiệu ứng mở thiệp 3D.",
      placement: "right",
    },
    {
      target: '[data-tour="canvas-stage"]',
      title: "🎨 2. Vùng Thiết Kế Thiệp Trực Quan",
      content: "Nhấp trực tiếp vào bất kỳ chữ, ảnh hoặc họa tiết trên thiệp để kéo thả, xoay và chỉnh sửa kích thước linh hoạt.",
      placement: "right",
    },
    {
      target: '[data-tour="properties-inspector"]',
      title: "⚙️ 3. Tùy Chỉnh Thuộc Tính & Màu Sắc",
      content: "Thay đổi phông chữ hoàng gia, cỡ chữ, bảng màu, hiệu ứng xuất hiện khi cuộn hoặc đổi tông màu nền tổng thể.",
      placement: "left",
    },
    {
      target: '[data-tour="top-bar"]',
      title: "🚀 4. Xem Thử & Xuất Bản Thiệp",
      content: "Hoàn tác (Ctrl+Z), phóng to/thu nhỏ, xem trước hiệu ứng 3D trên Mobile và bấm 'Xuất Bản' để nhận link gửi khách!",
      placement: "bottom",
    },
  ];

  const handleJoyrideEvent: EventHandler = (data) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      if (typeof window !== "undefined") {
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
      }
      onFinish?.();
    }
  };

  if (!isMounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      onEvent={handleJoyrideEvent}
      options={{
        showProgress: true,
        spotlightPadding: 6,
        skipBeacon: true,
        primaryColor: COLOR.gold.main,
      }}
      locale={{
        back: "Quay lại",
        close: "Đóng",
        last: "Bắt đầu tạo thiệp ✨",
        next: "Tiếp tục",
        skip: "Bỏ qua",
      }}
      styles={{
        overlay: {
          backgroundColor: "rgba(10, 8, 6, 0.65)",
        },
        tooltip: {
          borderRadius: RADIUS.lg,
          boxShadow: SHADOW.xl,
          padding: "16px 20px",
          border: `1px solid ${COLOR.borderGoldLight}`,
          fontFamily: "inherit",
          backgroundColor: COLOR.bgPaper,
        },
        tooltipTitle: {
          fontSize: FONT_SIZE.md,
          fontWeight: FONT_WEIGHT.bold,
          color: COLOR.textPrimary,
          marginBottom: 8,
        },
        tooltipContent: {
          fontSize: FONT_SIZE.sm,
          lineHeight: 1.6,
          color: COLOR.textSecondary,
          padding: "4px 0",
        },
        buttonPrimary: {
          backgroundColor: COLOR.gold.main,
          borderRadius: RADIUS.sm,
          fontSize: FONT_SIZE.xs,
          fontWeight: FONT_WEIGHT.semibold,
          padding: "8px 16px",
          color: COLOR.textInverse,
          outline: "none",
        },
        buttonBack: {
          color: COLOR.textSecondary,
          fontSize: FONT_SIZE.xs,
          fontWeight: FONT_WEIGHT.medium,
          marginRight: 10,
        },
        buttonSkip: {
          color: COLOR.textTertiary,
          fontSize: FONT_SIZE.xs,
        },
      }}
    />
  );
};
