import { envConfig } from "./env.config";

export const siteConfig = {
  name: "InviteMe",
  tagline: "Nền tảng thiết kế & gửi thiệp mời online thông minh, sang trọng",
  title: "InviteMe — Thiết kế thiệp cưới, sinh nhật và sự kiện trực tuyến",
  description:
    "Tạo thiệp cưới điện tử, sinh nhật và sự kiện trực tuyến sang trọng với hiệu ứng phong bì 3D, âm nhạc và quản lý RSVP thông minh. Chia sẻ dễ dàng qua Zalo, Messenger.",
  url: envConfig.appUrl,
  ogImage: "/images/og-image.png",
  keywords: [
    "InviteMe",
    "thiết kế thiệp mời online",
    "thiệp cưới online",
    "thiệp mời điện tử",
    "tạo thiệp cưới trực tuyến",
    "thiệp sinh nhật online",
    "thiệp cưới điện tử 3D",
    "rsvp online",
    "e-invitation",
    "mẫu thiệp cưới đẹp",
    "quản lý khách mời online",
  ],
  authors: [
    {
      name: "InviteMe Team",
      url: envConfig.appUrl,
    },
  ],
  creator: "InviteMe",
  locale: "vi_VN",
  themeColor: "#B78628",
  links: {
    facebook: "https://facebook.com/inviteme.vn",
    zalo: "https://zalo.me/inviteme",
    supportEmail: "hotro@inviteme.vn",
  },
} as const;
