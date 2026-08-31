export type InvitationEventType =
  | "WEDDING"
  | "BIRTHDAY"
  | "ANNIVERSARY"
  | "PARTY"
  | "CORPORATE";

export type InvitationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ICoupleMember {
  fullName: string;
  shortName?: string;
  fatherName?: string;
  motherName?: string;
  orderInFamily?: string; // Trưởng nam, Thứ nam, Ái nữ, v.v.
  avatar?: string;
  bio?: string;
}

export interface ICoupleData {
  groom: ICoupleMember;
  bride: ICoupleMember;
  story?: string;
}

export interface IEventLocation {
  venueName: string;
  address: string;
  mapUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IScheduleItem {
  id: string;
  title: string;
  time: string;
  date?: string;
  description?: string;
  iconName?: string;
  location?: string;
}

export interface IBankAccount {
  id: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountHolder: string;
  qrUrl?: string;
  branch?: string;
  role: "groom" | "bride" | "joint";
}

export interface IThemeConfig {
  fontIds: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  envelopeColor?: string;
  waxSealColor?: string;
  bgMusicUrl?: string;
  bgMusicTitle?: string;
  autoPlayMusic?: boolean;
  seasonalEffect?: "none" | "tet" | "noel" | "wedding" | "sakura" | "fireworks";
}

export interface ISectionVisibility {
  cover: boolean;
  couple: boolean;
  countdown: boolean;
  story: boolean;
  schedule: boolean;
  gallery: boolean;
  bankAccounts: boolean;
  rsvp: boolean;
  map: boolean;
}

export interface IInvitation {
  id: string;
  userId?: string;
  templateId?: string;
  slug: string;
  title: string;
  description?: string;
  eventType: InvitationEventType;
  status: InvitationStatus;
  
  eventDate: string;
  eventTime: string;
  coverImage: string;
  ogImage?: string;
  
  documentVersion: number;
  themeConfig: IThemeConfig;
  sectionVisibility: ISectionVisibility;
  sectionOrder: string[];
  
  coupleData?: ICoupleData;
  locationData: IEventLocation;
  scheduleData: IScheduleItem[];
  galleryData: string[];
  bankAccountsData: IBankAccount[];
  
  rsvpEnabled: boolean;
  rsvpConfig?: {
    deadlineDate?: string;
    maxGuestsPerRsvp?: number;
    requirePhone?: boolean;
  };
  
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITemplate {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  thumbnailUrl: string;
  previewSlug?: string;
  isPremium: boolean;
  isPopular: boolean;
  tags: string[];
  themeConfig: IThemeConfig;
  sampleData?: Partial<IInvitation>;
}

export interface IRsvpSubmission {
  guestName: string;
  phoneNumber?: string;
  attending: boolean;
  numberOfGuests: number;
  dietaryRequirements?: string;
  wishes?: string;
}

export interface IRsvp extends IRsvpSubmission {
  id: string;
  invitationId: string;
  createdAt: string;
}
