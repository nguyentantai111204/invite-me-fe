"use client";

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";
import { IInvitation, IScheduleItem, IBankAccount } from "@/interfaces/invitation.interface";
import { COLOR, RADIUS, FONT_WEIGHT, FONT_SIZE } from "@/constants/style.constant";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCol,
  StackRowAlignJustBetween,
} from "@/components/shared";

interface IEditorSidebarTabsProps {
  invitation: IInvitation;
  onChange: (updated: IInvitation) => void;
}

export const EditorSidebarTabs: React.FC<IEditorSidebarTabsProps> = ({ invitation, onChange }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const couple = invitation.coupleData || {
    groom: { fullName: "", shortName: "", fatherName: "", motherName: "", orderInFamily: "Trưởng Nam" },
    bride: { fullName: "", shortName: "", fatherName: "", motherName: "", orderInFamily: "Ái Nữ" },
  };

  // Helper updates
  const updateGroom = (field: string, val: string) => {
    onChange({
      ...invitation,
      coupleData: {
        ...couple,
        groom: { ...couple.groom, [field]: val },
      },
    });
  };

  const updateBride = (field: string, val: string) => {
    onChange({
      ...invitation,
      coupleData: {
        ...couple,
        bride: { ...couple.bride, [field]: val },
      },
    });
  };

  const updateLocation = (field: string, val: string) => {
    onChange({
      ...invitation,
      locationData: {
        ...invitation.locationData,
        [field]: val,
      },
    });
  };

  const updateTheme = (field: string, val: unknown) => {
    onChange({
      ...invitation,
      themeConfig: {
        ...invitation.themeConfig,
        [field]: val,
      },
    });
  };

  const addScheduleItem = () => {
    const newItem: IScheduleItem = {
      id: `sch-${Date.now()}`,
      title: "Tiết Mục Mới",
      time: "19:30",
      description: "Mô tả chi tiết tiết mục",
      iconName: "Favorite",
    };
    onChange({
      ...invitation,
      scheduleData: [...(invitation.scheduleData || []), newItem],
    });
  };

  const removeScheduleItem = (id: string) => {
    onChange({
      ...invitation,
      scheduleData: (invitation.scheduleData || []).filter((s) => s.id !== id),
    });
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 380 },
        height: "100%",
        backgroundColor: COLOR.bgPaper,
        borderRight: `1px solid ${COLOR.borderGoldLight}`,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${COLOR.divider}`,
          minHeight: 48,
          "& .MuiTab-root": {
            fontSize: "0.82rem",
            fontWeight: FONT_WEIGHT.semibold,
            textTransform: "none",
            minWidth: 80,
            px: 2,
          },
        }}
      >
        <Tab icon={<IconElement name="People" size="xs" />} label="Cặp Đôi" />
        <Tab icon={<IconElement name="Event" size="xs" />} label="Thời Gian" />
        <Tab icon={<IconElement name="AccessTime" size="xs" />} label="Lịch Trình" />
        <Tab icon={<IconElement name="Palette" size="xs" />} label="Giao Diện" />
        <Tab icon={<IconElement name="PhotoLibrary" size="xs" />} label="Album" />
        <Tab icon={<IconElement name="CardGiftcard" size="xs" />} label="RSVP & QR" />
      </Tabs>

      {/* Tab 0: Cặp Đôi */}
      {activeTab === 0 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={3}>
            <HeadingElement variant="h6" weight="bold">
              Thông Tin Chú Rể
            </HeadingElement>
            <TextField
              label="Họ và tên Chú Rể"
              fullWidth
              size="small"
              value={couple.groom.fullName}
              onChange={(e) => updateGroom("fullName", e.target.value)}
            />
            <TextField
              label="Tên gọi thân mật"
              fullWidth
              size="small"
              value={couple.groom.shortName}
              onChange={(e) => updateGroom("shortName", e.target.value)}
            />
            <TextField
              label="Thứ bậc (VD: Trưởng Nam)"
              fullWidth
              size="small"
              value={couple.groom.orderInFamily}
              onChange={(e) => updateGroom("orderInFamily", e.target.value)}
            />
            <TextField
              label="Họ tên Thân phụ Chú Rể"
              fullWidth
              size="small"
              value={couple.groom.fatherName}
              onChange={(e) => updateGroom("fatherName", e.target.value)}
            />
            <TextField
              label="Họ tên Thân mẫu Chú Rể"
              fullWidth
              size="small"
              value={couple.groom.motherName}
              onChange={(e) => updateGroom("motherName", e.target.value)}
            />

            <Divider />

            <HeadingElement variant="h6" weight="bold">
              Thông Tin Cô Dâu
            </HeadingElement>
            <TextField
              label="Họ và tên Cô Dâu"
              fullWidth
              size="small"
              value={couple.bride.fullName}
              onChange={(e) => updateBride("fullName", e.target.value)}
            />
            <TextField
              label="Tên gọi thân mật"
              fullWidth
              size="small"
              value={couple.bride.shortName}
              onChange={(e) => updateBride("shortName", e.target.value)}
            />
            <TextField
              label="Thứ bậc (VD: Ái Nữ)"
              fullWidth
              size="small"
              value={couple.bride.orderInFamily}
              onChange={(e) => updateBride("orderInFamily", e.target.value)}
            />
            <TextField
              label="Họ tên Thân phụ Cô Dâu"
              fullWidth
              size="small"
              value={couple.bride.fatherName}
              onChange={(e) => updateBride("fatherName", e.target.value)}
            />
            <TextField
              label="Họ tên Thân mẫu Cô Dâu"
              fullWidth
              size="small"
              value={couple.bride.motherName}
              onChange={(e) => updateBride("motherName", e.target.value)}
            />
          </StackCol>
        </Box>
      )}

      {/* Tab 1: Thời Gian & Địa Điểm */}
      {activeTab === 1 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={3}>
            <HeadingElement variant="h6" weight="bold">
              Thời Gian Tổ Chức
            </HeadingElement>
            <TextField
              label="Giờ tổ chức (VD: 18:00)"
              fullWidth
              size="small"
              value={invitation.eventTime}
              onChange={(e) => onChange({ ...invitation, eventTime: e.target.value })}
            />
            <TextField
              label="Ngày tổ chức (YYYY-MM-DD)"
              type="date"
              fullWidth
              size="small"
              value={invitation.eventDate ? invitation.eventDate.split("T")[0] : ""}
              onChange={(e) => onChange({ ...invitation, eventDate: new Date(e.target.value).toISOString() })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <Divider />

            <HeadingElement variant="h6" weight="bold">
              Địa Điểm Tổ Chức
            </HeadingElement>
            <TextField
              label="Tên Trung tâm tiệc cưới / Tư gia"
              fullWidth
              size="small"
              value={invitation.locationData?.venueName || ""}
              onChange={(e) => updateLocation("venueName", e.target.value)}
            />
            <TextField
              label="Địa chỉ chi tiết"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={invitation.locationData?.address || ""}
              onChange={(e) => updateLocation("address", e.target.value)}
            />
            <TextField
              label="Link Google Maps chỉ đường"
              fullWidth
              size="small"
              value={invitation.locationData?.mapUrl || ""}
              onChange={(e) => updateLocation("mapUrl", e.target.value)}
            />
          </StackCol>
        </Box>
      )}

      {/* Tab 2: Lịch Trình */}
      {activeTab === 2 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={2.5}>
            <StackRowAlignJustBetween>
              <HeadingElement variant="h6" weight="bold">
                Lịch Trình Hôn Lễ
              </HeadingElement>
              <ButtonElement
                variant="outline"
                size="small"
                rounded="md"
                onClick={addScheduleItem}
                leftIcon={<IconElement name="Add" size="xs" />}
              >
                Thêm Mục
              </ButtonElement>
            </StackRowAlignJustBetween>

            {(invitation.scheduleData || []).map((sch, sIdx) => (
              <Box
                key={sch.id}
                sx={{
                  p: 2,
                  borderRadius: RADIUS.md,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  backgroundColor: "#FAFAFA",
                }}
              >
                <StackRowAlignJustBetween sx={{ mb: 1 }}>
                  <TextElement size="xs" weight="bold" colorVariant="gold">
                    Mục #{sIdx + 1}
                  </TextElement>
                  <IconButton size="small" onClick={() => removeScheduleItem(sch.id)} color="error">
                    <IconElement name="Delete" size="xs" />
                  </IconButton>
                </StackRowAlignJustBetween>

                <TextField
                  label="Giờ"
                  size="small"
                  fullWidth
                  value={sch.time}
                  sx={{ mb: 1.5 }}
                  onChange={(e) => {
                    const newSch = [...invitation.scheduleData];
                    newSch[sIdx].time = e.target.value;
                    onChange({ ...invitation, scheduleData: newSch });
                  }}
                />
                <TextField
                  label="Tên hoạt động"
                  size="small"
                  fullWidth
                  value={sch.title}
                  sx={{ mb: 1.5 }}
                  onChange={(e) => {
                    const newSch = [...invitation.scheduleData];
                    newSch[sIdx].title = e.target.value;
                    onChange({ ...invitation, scheduleData: newSch });
                  }}
                />
                <TextField
                  label="Mô tả"
                  size="small"
                  fullWidth
                  value={sch.description || ""}
                  onChange={(e) => {
                    const newSch = [...invitation.scheduleData];
                    newSch[sIdx].description = e.target.value;
                    onChange({ ...invitation, scheduleData: newSch });
                  }}
                />
              </Box>
            ))}
          </StackCol>
        </Box>
      )}

      {/* Tab 3: Giao Diện & Màu Sắc */}
      {activeTab === 3 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={3}>
            <HeadingElement variant="h6" weight="bold">
              Bảng Màu Chủ Đạo
            </HeadingElement>

            <Box>
              <TextElement size="xs" weight="semibold" sx={{ mb: 1 }}>
                Màu sắc Hoàng Gia & Phong Cách
              </TextElement>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                {[
                  { name: "Royal Gold", primary: "#B78628", bg: "#FAF8F5" },
                  { name: "Rose Velvet", primary: "#DE7C66", bg: "#FFF9FA" },
                  { name: "Nordic Minimalist", primary: "#475569", bg: "#F8FAFC" },
                ].map((palette) => (
                  <Box
                    key={palette.name}
                    onClick={() => {
                      updateTheme("primaryColor", palette.primary);
                      updateTheme("backgroundColor", palette.bg);
                    }}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: RADIUS.md,
                      border: `2px solid ${invitation.themeConfig?.primaryColor === palette.primary ? COLOR.gold.main : COLOR.borderSecondary}`,
                      backgroundColor: palette.bg,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ width: 24, height: 24, borderRadius: RADIUS.full, backgroundColor: palette.primary, mx: "auto", mb: 0.5 }} />
                    <TextElement size="xs" weight="bold" sx={{ fontSize: "0.68rem" }}>
                      {palette.name}
                    </TextElement>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider />

            <HeadingElement variant="h6" weight="bold">
              Nhạc Nền & Hiệu Ứng
            </HeadingElement>
            <TextField
              label="Tên bài hát nhạc nền"
              size="small"
              fullWidth
              value={invitation.themeConfig?.bgMusicTitle || ""}
              onChange={(e) => updateTheme("bgMusicTitle", e.target.value)}
            />
            <TextField
              label="Đường dẫn file âm thanh MP3"
              size="small"
              fullWidth
              value={invitation.themeConfig?.bgMusicUrl || ""}
              onChange={(e) => updateTheme("bgMusicUrl", e.target.value)}
            />
          </StackCol>
        </Box>
      )}

      {/* Tab 4: Album Ảnh Cưới */}
      {activeTab === 4 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={2.5}>
            <HeadingElement variant="h6" weight="bold">
              Album Ảnh Cưới ({invitation.galleryData?.length || 0} ảnh)
            </HeadingElement>

            {(invitation.galleryData || []).map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  border: `1px solid ${COLOR.borderGoldLight}`,
                  borderRadius: RADIUS.md,
                }}
              >
                <Box component="img" src={img} sx={{ width: 48, height: 48, objectFit: "cover", borderRadius: RADIUS.xs }} />
                <TextField
                  size="small"
                  fullWidth
                  value={img}
                  onChange={(e) => {
                    const newGal = [...invitation.galleryData];
                    newGal[idx] = e.target.value;
                    onChange({ ...invitation, galleryData: newGal });
                  }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    const newGal = invitation.galleryData.filter((_, i) => i !== idx);
                    onChange({ ...invitation, galleryData: newGal });
                  }}
                >
                  <IconElement name="Delete" size="xs" />
                </IconButton>
              </Box>
            ))}
          </StackCol>
        </Box>
      )}

      {/* Tab 5: RSVP & QR VietQR */}
      {activeTab === 5 && (
        <Box sx={{ p: 3 }}>
          <StackCol spacing={3}>
            <HeadingElement variant="h6" weight="bold">
              Cấu Hình RSVP Online
            </HeadingElement>
            <FormControlLabel
              control={
                <Switch
                  checked={invitation.rsvpEnabled}
                  onChange={(e) => onChange({ ...invitation, rsvpEnabled: e.target.checked })}
                  color="primary"
                />
              }
              label="Bật form xác nhận tham dự"
            />
            <TextField
              label="Hạn chót gửi phản hồi RSVP"
              size="small"
              fullWidth
              value={invitation.rsvpConfig?.deadlineDate || ""}
              onChange={(e) =>
                onChange({
                  ...invitation,
                  rsvpConfig: { ...invitation.rsvpConfig, deadlineDate: e.target.value },
                })
              }
            />

            <Divider />

            <HeadingElement variant="h6" weight="bold">
              Tài Khoản Mừng Cưới VietQR
            </HeadingElement>

            {(invitation.bankAccountsData || []).map((acc, aIdx) => (
              <Box key={acc.id} sx={{ p: 2, border: `1px solid ${COLOR.borderGoldLight}`, borderRadius: RADIUS.md }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" sx={{ mb: 1 }}>
                  Tài khoản {acc.role === "groom" ? "Chú Rể" : "Cô Dâu"}
                </TextElement>
                <TextField
                  label="Ngân hàng"
                  size="small"
                  fullWidth
                  value={acc.bankName}
                  sx={{ mb: 1 }}
                  onChange={(e) => {
                    const newAccs = [...invitation.bankAccountsData];
                    newAccs[aIdx].bankName = e.target.value;
                    onChange({ ...invitation, bankAccountsData: newAccs });
                  }}
                />
                <TextField
                  label="Số tài khoản"
                  size="small"
                  fullWidth
                  value={acc.accountNumber}
                  sx={{ mb: 1 }}
                  onChange={(e) => {
                    const newAccs = [...invitation.bankAccountsData];
                    newAccs[aIdx].accountNumber = e.target.value;
                    onChange({ ...invitation, bankAccountsData: newAccs });
                  }}
                />
                <TextField
                  label="Tên chủ tài khoản"
                  size="small"
                  fullWidth
                  value={acc.accountHolder}
                  onChange={(e) => {
                    const newAccs = [...invitation.bankAccountsData];
                    newAccs[aIdx].accountHolder = e.target.value;
                    onChange({ ...invitation, bankAccountsData: newAccs });
                  }}
                />
              </Box>
            ))}
          </StackCol>
        </Box>
      )}
    </Box>
  );
};
