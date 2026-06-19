export type LeadStatus = "NEW" | "QUALIFIED" | "PITCHED" | "REPLIED" | "MEETING_NEEDED" | "WON" | "LOST";

export interface Agency {
  id: string;
  userId: string;
  name: string;
  businessType: string;
  services: string;
  targetIndustry: string;
  idealCustomer: string;
  pricingRange: string;
  tone: string;
  faqs: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  userId: string;
  agencyId: string;
  name: string;
  company: string;
  email: string;
  website: string;
  industry: string;
  status: LeadStatus;
  aiScore?: number;
  aiCategory?: string;
  aiReasoning?: string;
  aiServiceAngle?: string;
  aiPainPoints?: string[];
  createdAt: string;
  updatedAt: string;
  qualifiedAt?: string;
}

export interface Message {
  id: string;
  leadId: string;
  agencyId: string;
  subject: string;
  content: string;
  status: "DRAFT" | "SENT";
  sentAt?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  scheduledAt: string;
  content: string;
  status: "PENDING" | "SENT";
}
