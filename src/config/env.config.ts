export const envConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://inviteme.vn",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.inviteme.vn/api/v1",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;
