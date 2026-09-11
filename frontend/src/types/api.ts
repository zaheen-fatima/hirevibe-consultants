export type PageResponse<T> = {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED';
export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED';
export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'REPLIED' | 'CLOSED';
export type AuditAction = 'LOGIN' | 'LOGIN_FAILED' | 'LOGOUT' | 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'STATUS_CHANGE' | 'ACTIVATE' | 'DEACTIVATE' | 'UPLOAD' | 'DOWNLOAD';

export type LoginRequest = { email: string; password: string };
export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  userId: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};
export type RefreshTokenResponse = { accessToken: string; tokenType: string; refreshToken: string };

export type DashboardResponse = {
  totalJobs: number; activeJobs: number; totalApplications: number; totalInquiries: number; totalContacts: number; totalArticles: number; publishedArticles: number; totalVideos: number; publishedVideos: number; totalUsers: number; applicationStatuses: Record<ApplicationStatus, number>; recentActivity: AuditLogResponse[]; snapshotAt: string;
};

export type Job = { id: number; title: string; location: string; description: string; type: string; active: boolean; createdAt: string; updatedAt: string };
export type Application = { id: number; jobId: number; jobTitle: string; jobLocation: string; name: string; email: string; phone: string; qualification: string; status: ApplicationStatus; appliedAt: string; updatedAt: string; resumeAvailable: boolean };
export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  serviceType: string;
  hiringRequirement: string;
  location: string | null;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
};
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type Review = {
  id: number;
  name: string;
  roleTitle: string | null;
  company: string | null;
  rating: number;
  reviewText: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};
export type Contact = { id: number; name: string; email: string; phone: string; subject: string; message: string; status: ContactStatus; adminReply: string | null; repliedAt: string | null; createdAt: string; updatedAt: string };
export type Article = { id: number; title: string; slug: string; excerpt: string; content: string; category: string; featuredImage: string | null; published: boolean; createdAt: string; updatedAt: string; publishedAt: string | null };
export type Video = { id: number; title: string; slug: string; description: string; videoUrl: string; thumbnailUrl: string | null; category: string; published: boolean; featured: boolean; createdAt: string; updatedAt: string; publishedAt: string | null };
export type User = { id: number; name: string; email: string; role: string; enabled: boolean };
export type Role = { id: number; name: string; permissions: string[] };
export type Permission = { id: number; name: string };
export type AuditLogResponse = { id: number; userId: number | null; userEmail: string | null; action: AuditAction; entityType: string; entityId: string; description: string; ipAddress: string | null; userAgent: string | null; metadata: string | null; beforeState: string | null; afterState: string | null; changedFields: string | null; createdAt: string };
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};