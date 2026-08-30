export const formatDateTimeVietnamese = (date?: string | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

export const countDownTime = (date: string) => {
  const countDownDate = new Date(date).getTime();
  const now = new Date().getTime();
  const distance = countDownDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const getDayInWeekVietnamese = (date: Date): string => {
  const daysInWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return daysInWeek[date.getDay()];
};

export const getMonthVietnamese = (month: number): string => {
  const monthsInWeek = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  return monthsInWeek[month - 1];
};
