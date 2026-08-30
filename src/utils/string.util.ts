export const trimString = (value: string | null | undefined): string => {
  if (!value) return "";
  return value.trim();
};

export const normalizePhone = (phone?: string | null): string => {
  return phone
    ? phone.replace(/\s/g, "").replace(/\D/g, "").replace(/^0/, "84")
    : "";
};

export const upperCaseFirstChar = (value: string): string => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const upperCaseString = (value: string): string => {
  if (!value) return "";
  return value.toUpperCase();
};

export const lowerCaseString = (value: string): string => {
  if (!value) return "";
  return value.toLowerCase();
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

