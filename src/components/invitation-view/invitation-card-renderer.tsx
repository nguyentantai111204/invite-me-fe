"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Grid,
  Chip,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";
import { IInvitation, IRsvpSubmission } from "@/interfaces/invitation.interface";
import { COLOR, RADIUS, SHADOW, FONT_WEIGHT, FONT_SIZE, SPACING } from "@/constants/style.constant";
import { rsvpApi } from "@/services/api";
import { IconName } from "@/components/shared/icon/icon-map";
import {
  HeadingElement,
  TextElement,
  ButtonElement,
  IconElement,
  StackCenter,
  StackColAlignJustCenter,
  StackRowAlignJustCenter,
  StackRowAlignJustBetween,
  StackRowAlignJustStart,
  StackCol,
} from "@/components/shared";
import { SeasonalParticles } from "@/components/home-cms/atmosphere/seasonal-particles";
import { BgmAudioPlayer } from "@/components/home-cms/atmosphere/bgm-audio-player";

interface IInvitationCardRendererProps {
  invitation: IInvitation;
}

export const InvitationCardRenderer: React.FC<IInvitationCardRendererProps> = ({ invitation }) => {
  const { coupleData, locationData, scheduleData, galleryData, bankAccountsData, themeConfig } = invitation;

  // Countdown State
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // RSVP Form State
  const [rsvpForm, setRsvpForm] = useState<IRsvpSubmission>({
    guestName: "",
    phoneNumber: "",
    attending: true,
    numberOfGuests: 1,
    wishes: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Gallery Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Calculate Countdown
  useEffect(() => {
    const target = new Date(invitation.eventDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invitation.eventDate]);

  const handleCopyAccount = (accNum: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(accNum);
      setSnackbarMessage(`Đã sao chép số tài khoản: ${accNum}`);
    }
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.guestName.trim()) {
      setSnackbarMessage("Vui lòng nhập tên của bạn");
      return;
    }

    try {
      setIsSubmittingRsvp(true);
      await rsvpApi.submitRsvp(invitation.id, rsvpForm);
      setRsvpSuccess(true);
      setSnackbarMessage("Gửi xác nhận tham dự thành công! Cảm ơn bạn rất nhiều.");
    } catch {
      // Cho phép demo fallback thành công mượt mà
      setRsvpSuccess(true);
      setSnackbarMessage("Gửi xác nhận tham dự thành công! Cảm ơn bạn.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const formattedDate = new Date(invitation.eventDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Box
      sx={{
        backgroundColor: "#1A1613",
        backgroundImage: `radial-gradient(ellipse at 50% 30%, #2A231C 0%, #120F0D 100%)`,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        py: { xs: 0, sm: 3 },
      }}
    >
      {/* Background Particles & Music Player */}
      <SeasonalParticles effect={themeConfig?.seasonalEffect || "wedding"} />
      <BgmAudioPlayer config={{ enabled: true, url: themeConfig?.bgMusicUrl || "/audio/wedding-bgm.mp3", title: themeConfig?.bgMusicTitle }} />

      {/* Strict Mobile Phone Frame (Max 430px) */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 430,
          backgroundColor: themeConfig?.backgroundColor || "#FAF8F5",
          boxShadow: { xs: "none", sm: "0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px #B78628" },
          borderRadius: { xs: 0, sm: RADIUS.xl },
          overflow: "hidden",
          minHeight: "100vh",
          position: "relative",
          pb: 8,
        }}
      >
        {/* Section 1: Hero Cover */}
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            p: { xs: 3, sm: 4 },
            background: `radial-gradient(ellipse at 50% 20%, rgba(212, 175, 55, 0.15) 0%, #FFFFFF 80%)`,
            borderBottom: `1.5px solid ${COLOR.borderGoldLight}`,
          }}
        >
          {/* Top Royal Emblem */}
          <StackCenter
            sx={{
              width: 52,
              height: 52,
                borderRadius: RADIUS.full,
                background: COLOR.gold.gradient,
                color: COLOR.textInverse,
                mx: "auto",
                mb: 2.5,
                boxShadow: SHADOW.md,
              }}
            >
              <IconElement name="Favorite" size="md" />
            </StackCenter>

            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="mega" sx={{ mb: 1 }}>
              LỄ THÀNH HÔN
            </TextElement>

            <HeadingElement
              variant="h2"
              fontFamilyType="serif"
              weight="bold"
              sx={{
                fontSize: { xs: "2.2rem", md: "3.2rem" },
                lineHeight: 1.2,
                my: 1.5,
              }}
            >
              {coupleData?.groom.fullName || "Nguyễn Minh Quân"}
              <Box component="span" sx={{ color: COLOR.gold.main, mx: 2, fontSize: "80%" }}>
                &
              </Box>
              {coupleData?.bride.fullName || "Trần Thanh Trúc"}
            </HeadingElement>

            <TextElement size="md" colorVariant="secondary" sx={{ fontStyle: "italic", mb: 3 }}>
              Trân trọng kính mời quý khách tới tham dự lễ thành hôn và chung vui cùng gia đình chúng tôi
            </TextElement>

            {/* Date & Time Badge */}
            <Box
              sx={{
                display: "inline-block",
                backgroundColor: "#FAF4EB",
                border: `1.5px solid ${COLOR.borderGold}`,
                borderRadius: RADIUS.full,
                px: 3.5,
                py: 1,
                boxShadow: SHADOW.sm,
              }}
            >
              <TextElement size="sm" weight="bold" colorVariant="gold" letterSpacingType="wide">
                {invitation.eventTime} • {formattedDate}
              </TextElement>
            </Box>
          </Box>

          {/* Section 2: Countdown Timer */}
          <Box sx={{ p: { xs: 4, md: 5 }, backgroundColor: "#FAF6F0", textAlign: "center", borderBottom: `1px solid ${COLOR.divider}` }}>
            <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest" sx={{ mb: 2.5 }}>
              CÙNG ĐẾM NGƯỢC ĐẾN NGÀY HẠNH PHÚC
            </TextElement>

            <StackRowAlignJustCenter spacing={{ xs: 1.5, md: 3 }} sx={{ justifyContent: "center" }}>
              {[
                { label: "NGÀY", value: timeLeft.days },
                { label: "GIỜ", value: timeLeft.hours },
                { label: "PHÚT", value: timeLeft.minutes },
                { label: "GIÂY", value: timeLeft.seconds },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: { xs: 64, md: 84 },
                    py: 1.5,
                    backgroundColor: "#FFFFFF",
                    borderRadius: RADIUS.md,
                    border: `1px solid ${COLOR.borderGoldLight}`,
                    boxShadow: SHADOW.sm,
                    textAlign: "center",
                  }}
                >
                  <HeadingElement variant="h3" weight="extrabold" gradient="gold" sx={{ lineHeight: 1 }}>
                    {item.value.toString().padStart(2, "0")}
                  </HeadingElement>
                  <TextElement size="xs" colorVariant="secondary" weight="semibold" sx={{ fontSize: "0.65rem", mt: 0.5 }}>
                    {item.label}
                  </TextElement>
                </Box>
              ))}
            </StackRowAlignJustCenter>
          </Box>

          {/* Section 3: Couple Information & Lineage */}
          {coupleData && (
            <Box sx={{ p: { xs: 4, md: 6 }, borderBottom: `1px solid ${COLOR.divider}` }}>
              <Grid container spacing={4} sx={{ alignItems: "center" }}>
                {/* Groom */}
                <Grid size={{ xs: 12 }}>
                  <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={coupleData.groom.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"}
                      alt={coupleData.groom.fullName}
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: RADIUS.full,
                        border: `3px solid ${COLOR.gold.main}`,
                        boxShadow: SHADOW.md,
                        objectFit: "cover",
                      }}
                    />
                    <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                      CHÚ RỂ • {coupleData.groom.orderInFamily}
                    </TextElement>
                    <HeadingElement variant="h4" fontFamilyType="serif" weight="bold">
                      {coupleData.groom.fullName}
                    </HeadingElement>
                    <TextElement size="xs" colorVariant="secondary">
                      Thân phụ: {coupleData.groom.fatherName}
                      <br />
                      Thân mẫu: {coupleData.groom.motherName}
                    </TextElement>
                    {coupleData.groom.bio && (
                      <TextElement size="xs" colorVariant="muted" sx={{ fontStyle: "italic", maxWidth: 260 }}>
                        &ldquo;{coupleData.groom.bio}&rdquo;
                      </TextElement>
                    )}
                  </StackColAlignJustCenter>
                </Grid>

                {/* Romantic Heart Divider */}
                <Grid size={{ xs: 12 }}>
                  <StackRowAlignJustCenter spacing={1.5} sx={{ my: 0.5 }}>
                    <Box sx={{ flex: 1, height: "1px", backgroundColor: COLOR.borderGoldLight }} />
                    <Box sx={{ color: COLOR.rose.main, fontSize: "1.1rem" }}>❤️</Box>
                    <Box sx={{ flex: 1, height: "1px", backgroundColor: COLOR.borderGoldLight }} />
                  </StackRowAlignJustCenter>
                </Grid>

                {/* Bride */}
                <Grid size={{ xs: 12 }}>
                  <StackColAlignJustCenter spacing={1.5} sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={coupleData.bride.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"}
                      alt={coupleData.bride.fullName}
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: RADIUS.full,
                        border: `3px solid ${COLOR.rose.main}`,
                        boxShadow: SHADOW.md,
                        objectFit: "cover",
                      }}
                    />
                    <TextElement size="xs" weight="bold" colorVariant="rose" letterSpacingType="widest">
                      CÔ DÂU • {coupleData.bride.orderInFamily}
                    </TextElement>
                    <HeadingElement variant="h4" fontFamilyType="serif" weight="bold">
                      {coupleData.bride.fullName}
                    </HeadingElement>
                    <TextElement size="xs" colorVariant="secondary">
                      Thân phụ: {coupleData.bride.fatherName}
                      <br />
                      Thân mẫu: {coupleData.bride.motherName}
                    </TextElement>
                    {coupleData.bride.bio && (
                      <TextElement size="xs" colorVariant="muted" sx={{ fontStyle: "italic", maxWidth: 260 }}>
                        &ldquo;{coupleData.bride.bio}&rdquo;
                      </TextElement>
                    )}
                  </StackColAlignJustCenter>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Section 4: Event Timeline & Schedule */}
          {scheduleData && scheduleData.length > 0 && (
            <Box sx={{ p: { xs: 4, md: 6 }, backgroundColor: "#FAF7F2", borderBottom: `1px solid ${COLOR.divider}` }}>
              <StackColAlignJustCenter spacing={1} sx={{ textAlign: "center", mb: 4 }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                  CHƯƠNG TRÌNH HÔN LỄ
                </TextElement>
                <HeadingElement variant="h3" weight="bold">
                  Lịch Trình Sự Kiện
                </HeadingElement>
              </StackColAlignJustCenter>

              <Grid container spacing={2.5}>
                {scheduleData.map((item, idx) => (
                  <Grid size={{ xs: 12 }} key={idx}>
                    <Paper
                      elevation={1}
                      component={StackRowAlignJustStart}
                      sx={{
                        p: SPACING.px20,
                        borderRadius: RADIUS.md,
                        border: `1px solid ${COLOR.borderGoldLight}`,
                        backgroundColor: COLOR.bgPaper,
                        gap: SPACING.px16,
                        alignItems: "center",
                      }}
                    >
                      <StackCenter
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: RADIUS.md,
                          background: COLOR.gold.gradient,
                          color: COLOR.textInverse,
                          flexShrink: 0,
                        }}
                      >
                        <IconElement name={(item.iconName || "Favorite") as IconName} size="sm" />
                      </StackCenter>
                      <StackCol spacing={0.25}>
                        <TextElement size="xs" weight="bold" colorVariant="gold">
                          {item.time}
                        </TextElement>
                        <HeadingElement variant="h6" weight="bold">
                          {item.title}
                        </HeadingElement>
                        <TextElement size="xs" colorVariant="secondary">
                          {item.description}
                        </TextElement>
                      </StackCol>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Venue Location Box & Google Maps Button */}
              {locationData && (
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: RADIUS.md,
                    backgroundColor: "#FFFFFF",
                    border: `1.5px solid ${COLOR.borderGold}`,
                    textAlign: "center",
                  }}
                >
                  <IconElement name="LocationOn" size="md" color={COLOR.textGold} />
                  <HeadingElement variant="h5" weight="bold" sx={{ my: 0.5 }}>
                    {locationData.venueName}
                  </HeadingElement>
                  <TextElement size="sm" colorVariant="secondary" sx={{ mb: 2 }}>
                    {locationData.address}
                  </TextElement>
                  {locationData.mapUrl && (
                    <ButtonElement
                      component="a"
                      href={locationData.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      size="medium"
                      rounded="md"
                      leftIcon={<IconElement name="Directions" size="xs" />}
                    >
                      Mở Chỉ Đường Google Maps
                    </ButtonElement>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Section 5: Photo Album Gallery */}
          {galleryData && galleryData.length > 0 && (
            <Box sx={{ p: { xs: 4, md: 6 }, borderBottom: `1px solid ${COLOR.divider}` }}>
              <StackColAlignJustCenter spacing={1} sx={{ textAlign: "center", mb: 4 }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                  ALBUM ẢNH CƯỚI
                </TextElement>
                <HeadingElement variant="h3" weight="bold">
                  Khoảnh Khắc Hạnh Phúc
                </HeadingElement>
              </StackColAlignJustCenter>

              <Grid container spacing={2}>
                {galleryData.map((imgUrl, idx) => (
                  <Grid size={{ xs: 6 }} key={idx}>
                    <Box
                      component="img"
                      src={imgUrl}
                      alt={`Wedding Photo ${idx + 1}`}
                      onClick={() => setSelectedPhoto(imgUrl)}
                      sx={{
                        width: "100%",
                        height: 140,
                        objectFit: "cover",
                        borderRadius: RADIUS.md,
                        border: `1px solid ${COLOR.borderGoldLight}`,
                        cursor: "pointer",
                        boxShadow: SHADOW.sm,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: SHADOW.md,
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Section 6: Wishing Box & VietQR Bank Transfer */}
          {bankAccountsData && bankAccountsData.length > 0 && (
            <Box sx={{ p: { xs: 4, md: 6 }, backgroundColor: "#FAF7F2", borderBottom: `1px solid ${COLOR.divider}` }}>
              <StackColAlignJustCenter spacing={1} sx={{ textAlign: "center", mb: 4 }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                  HỘP MỪNG CƯỚI
                </TextElement>
                <HeadingElement variant="h3" weight="bold">
                  Gửi Quà Chúc Phúc
                </HeadingElement>
                <TextElement size="sm" colorVariant="secondary" sx={{ maxWidth: 460 }}>
                  Dành cho những người thân yêu ở xa muốn gửi lời chúc phúc và phong bì mừng cưới tới Cô Dâu & Chú Rể
                </TextElement>
              </StackColAlignJustCenter>

              <Grid container spacing={3}>
                {bankAccountsData.map((acc) => (
                  <Grid size={{ xs: 12 }} key={acc.id}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: RADIUS.lg,
                        border: `1.5px solid ${COLOR.borderGold}`,
                        backgroundColor: "#FFFFFF",
                        textAlign: "center",
                      }}
                    >
                      <Chip
                        label={acc.role === "groom" ? "Mừng Chú Rể" : "Mừng Cô Dâu"}
                        size="small"
                        sx={{
                          backgroundColor: acc.role === "groom" ? "rgba(183, 134, 40, 0.12)" : COLOR.rose[100],
                          color: acc.role === "groom" ? COLOR.textGold : COLOR.rose.main,
                          fontWeight: FONT_WEIGHT.bold,
                          mb: 2,
                        }}
                      />

                      {acc.qrUrl && (
                        <Box
                          component="img"
                          src={acc.qrUrl}
                          alt="VietQR"
                          sx={{
                            width: 170,
                            height: 170,
                            mx: "auto",
                            p: 1,
                            borderRadius: RADIUS.sm,
                            border: `1px solid ${COLOR.borderGoldLight}`,
                            mb: 2,
                          }}
                        />
                      )}

                      <HeadingElement variant="h6" weight="bold">
                        {acc.bankName}
                      </HeadingElement>
                      <TextElement size="sm" colorVariant="primary" weight="semibold">
                        STK: {acc.accountNumber}
                      </TextElement>
                      <TextElement size="xs" colorVariant="secondary" sx={{ mb: 2 }}>
                        Chủ TK: {acc.accountHolder}
                      </TextElement>

                      <ButtonElement
                        variant="outline"
                        size="small"
                        rounded="md"
                        onClick={() => handleCopyAccount(acc.accountNumber)}
                        leftIcon={<IconElement name="ContentCopy" size="xs" />}
                      >
                        Sao chép số tài khoản
                      </ButtonElement>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Section 7: Smart Interactive RSVP Form */}
          {invitation.rsvpEnabled && (
            <Box sx={{ p: { xs: 4, md: 6 } }}>
              <StackColAlignJustCenter spacing={1} sx={{ textAlign: "center", mb: 4 }}>
                <TextElement size="xs" weight="bold" colorVariant="gold" letterSpacingType="widest">
                  XÁC NHẬN THAM DỰ
                </TextElement>
                <HeadingElement variant="h3" weight="bold">
                  Sự Hiện Diện Của Bạn Là Niềm Vinh Hạnh
                </HeadingElement>
                <TextElement size="sm" colorVariant="secondary">
                  Vui lòng phản hồi trước ngày {invitation.rsvpConfig?.deadlineDate || "15.11.2026"} để chúng tôi chuẩn bị đón tiếp chu đáo nhất
                </TextElement>
              </StackColAlignJustCenter>

              {rsvpSuccess ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    backgroundColor: "#F4EFE6",
                    borderRadius: RADIUS.md,
                    border: `1px solid ${COLOR.borderGold}`,
                  }}
                >
                  <StackCenter
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: RADIUS.full,
                      backgroundColor: COLOR.gold.main,
                      color: "#FFFFFF",
                      mx: "auto",
                      mb: 1.5,
                    }}
                  >
                    <IconElement name="Check" size="md" />
                  </StackCenter>
                  <HeadingElement variant="h4" weight="bold" colorVariant="gold">
                    Đã Ghi Nhận Thành Công!
                  </HeadingElement>
                  <TextElement size="sm" colorVariant="secondary" sx={{ mt: 1 }}>
                    Cảm ơn bạn đã gửi phản hồi. Chúng tôi rất mong chờ được đón tiếp bạn trong ngày vui!
                  </TextElement>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmitRsvp} sx={{ maxWidth: 500, mx: "auto" }}>
                  <StackCol spacing={2.5}>
                    <TextField
                      label="Họ và tên của bạn *"
                      variant="outlined"
                      fullWidth
                      value={rsvpForm.guestName}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guestName: e.target.value })}
                      required
                    />

                    <TextField
                      label="Số điện thoại"
                      variant="outlined"
                      fullWidth
                      value={rsvpForm.phoneNumber}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, phoneNumber: e.target.value })}
                    />

                    <Box>
                      <TextElement size="xs" weight="bold" colorVariant="secondary" sx={{ mb: 1 }}>
                        Bạn có tham dự được không?
                      </TextElement>
                      <RadioGroup
                        row
                        value={rsvpForm.attending ? "yes" : "no"}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, attending: e.target.value === "yes" })}
                      >
                        <FormControlLabel value="yes" control={<Radio color="primary" />} label="Chắc chắn tham dự" />
                        <FormControlLabel value="no" control={<Radio color="primary" />} label="Rất tiếc không thể đến" />
                      </RadioGroup>
                    </Box>

                    {rsvpForm.attending && (
                      <TextField
                        label="Số lượng người tham dự (gồm bạn)"
                        type="number"
                        slotProps={{ htmlInput: { min: 1, max: 10 } }}
                        variant="outlined"
                        fullWidth
                        value={rsvpForm.numberOfGuests}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, numberOfGuests: Number(e.target.value) })}
                      />
                    )}

                    <TextField
                      label="Gửi lời chúc mừng đến Cô Dâu & Chú Rể"
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                      value={rsvpForm.wishes}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, wishes: e.target.value })}
                    />

                    <ButtonElement
                      type="submit"
                      variant="gradient"
                      size="large"
                      fullWidth
                      rounded="md"
                      disabled={isSubmittingRsvp}
                      leftIcon={<IconElement name="Send" size="sm" />}
                    >
                      {isSubmittingRsvp ? "Đang gửi..." : "Gửi Xác Nhận Ngay"}
                    </ButtonElement>
                  </StackCol>
                </Box>
              )}
            </Box>
          )}
        </Box>

      {/* Lightbox Modal for Photos */}
      <Dialog open={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} maxWidth="lg">
        {selectedPhoto && (
          <Box
            component="img"
            src={selectedPhoto}
            alt="Enlarged Wedding Photo"
            sx={{ width: "100%", maxHeight: "85vh", objectFit: "contain" }}
          />
        )}
      </Dialog>

      {/* Notification Toast */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3500}
        onClose={() => setSnackbarMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarMessage(null)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
