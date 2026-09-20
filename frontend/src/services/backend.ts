import { api } from './api';
import type { Application, ApplicationStatus, Article, AuditLogResponse, Contact,Review,
  ReviewStatus, ContactStatus, DashboardResponse, Inquiry, InquiryStatus, Job, PageResponse, Permission, Role, User, Video } from '../types/api';

type QueryValue = string | number | boolean | undefined;
type QueryParams = Record<string, QueryValue>;

function emptyPage<T>(size = 0): PageResponse<T> {
  return { content: [], pageable: { pageNumber: 0, pageSize: size, sort: { sorted: false, unsorted: true, empty: true }, offset: 0, paged: true, unpaged: false }, totalPages: 0, totalElements: 0, last: true, first: true, size, number: 0, numberOfElements: 0, empty: true };
}

function isNetworkFailure(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'request' in error && !('response' in error));
}

async function safePublicPage<T>(request: Promise<{ data: PageResponse<T> }>, size = 0): Promise<PageResponse<T>> {
  try { return (await request).data; }
  catch (error) { if (isNetworkFailure(error)) return emptyPage<T>(size); throw error; }
}

export const dashboardApi = {
  get: async (): Promise<DashboardResponse> => {
    const one = { page: 0, size: 1 };
    const [jobs, activeJobs, applications, inquiries, contacts, articles, publishedArticles, videos, publishedVideos, users, audit] = await Promise.all([
      jobsApi.list(one), jobsApi.list({ ...one, active: true }), applicationsApi.list({ page: 0, size: 1000 }), inquiriesApi.list(one), contactsApi.list(one), articlesApi.list(one), articlesApi.publicList(one), videosApi.list(one), videosApi.publicList(one), usersApi.list(one), auditApi.list({ page: 0, size: 8 }),
    ]);
    const statuses: Record<ApplicationStatus, number> = { APPLIED: 0, UNDER_REVIEW: 0, SHORTLISTED: 0, INTERVIEW: 0, SELECTED: 0, REJECTED: 0 };
    for (const item of applications.content) statuses[item.status] += 1;
    return { totalJobs: jobs.totalElements, activeJobs: activeJobs.totalElements, totalApplications: applications.totalElements, totalInquiries: inquiries.totalElements, totalContacts: contacts.totalElements, totalArticles: articles.totalElements, publishedArticles: publishedArticles.totalElements, totalVideos: videos.totalElements, publishedVideos: publishedVideos.totalElements, totalUsers: users.totalElements, applicationStatuses: statuses, recentActivity: audit.content, snapshotAt: new Date().toISOString() };
  },
};

export const jobsApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<Job>>('/jobs', { params })).data,
  publicList: async (params?: QueryParams) => safePublicPage(api.get<PageResponse<Job>>('/jobs/public', { params }), Number(params?.size ?? 0)),
  getPublicById: async (id: number) =>
      (await api.get<Job>(`/jobs/public/${id}`)).data,
  get: async (id: number) => (await api.get<Job>(`/jobs/${id}`)).data,
  create: async (payload: Omit<Job, 'id' | 'active' | 'createdAt' | 'updatedAt'>) => (await api.post<Job>('/jobs', payload)).data,
  update: async (id: number, payload: Partial<Pick<Job, 'title' | 'location' | 'description' | 'type'>>) => (await api.put<Job>(`/jobs/${id}`, payload)).data,
  activate: async (id: number) => (await api.patch<Job>(`/jobs/${id}/activate`)).data,
  deactivate: async (id: number) => (await api.patch<Job>(`/jobs/${id}/deactivate`)).data,
  remove: async (id: number) => { await api.delete(`/jobs/${id}`); },
};

export const applicationsApi = {
  create: async (payload: FormData) => (await api.post<Application>('/applications', payload, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  list: async (params?: QueryParams) => (await api.get<PageResponse<Application>>('/applications', { params })).data,
  get: async (id: number) => (await api.get<Application>(`/applications/${id}`)).data,
  updateStatus: async (id: number, status: ApplicationStatus) => (await api.patch<Application>(`/applications/${id}/status`, { status })).data,
  downloadResume: async (id: number) => (await api.get(`/applications/${id}/resume`, { responseType: 'blob' })).data,
  remove: async (id: number) => { await api.delete(`/applications/${id}`); },
};

export const inquiriesApi = {
  create: async (payload: Record<string, string>) => (await api.post<Inquiry>('/inquiries', payload)).data,
  list: async (params?: QueryParams) => (await api.get<PageResponse<Inquiry>>('/inquiries', { params })).data,
  get: async (id: number) => (await api.get<Inquiry>(`/inquiries/${id}`)).data,
  updateStatus: async (id: number, status: InquiryStatus) => (await api.patch<Inquiry>(`/inquiries/${id}/status`, { status })).data,
  reply: async (id: number, reply: string) => (await api.patch<Inquiry>(`/inquiries/${id}/reply`, { reply })).data,
  remove: async (id: number) => { await api.delete(`/inquiries/${id}`); },
};

export const contactsApi = {
  create: async (payload: Record<string, string>) => (await api.post<Contact>('/contacts', payload)).data,
  list: async (params?: QueryParams) => (await api.get<PageResponse<Contact>>('/contacts', { params })).data,
  get: async (id: number) => (await api.get<Contact>(`/contacts/${id}`)).data,
  update: async (id: number, payload: Record<string, string>) => (await api.put<Contact>(`/contacts/${id}`, payload)).data,
  updateStatus: async (id: number, status: ContactStatus) => (await api.patch<Contact>(`/contacts/${id}/status`, { status })).data,
  reply: async (id: number, reply: string) => (await api.patch<Contact>(`/contacts/${id}/reply`, { reply })).data,
  remove: async (id: number) => { await api.delete(`/contacts/${id}`); },
};

export const articlesApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<Article>>('/articles', { params })).data,
  publicList: async (params?: QueryParams) => safePublicPage(api.get<PageResponse<Article>>('/articles/public', { params }), Number(params?.size ?? 0)),
  get: async (id: number) => (await api.get<Article>(`/articles/${id}`)).data,
  getPublicBySlug: async (slug: string) => (await api.get<Article>(`/articles/public/${slug}`)).data,
  create: async (payload: Record<string, unknown>) => (await api.post<Article>('/articles', payload)).data,
  update: async (id: number, payload: Record<string, unknown>) => (await api.put<Article>(`/articles/${id}`, payload)).data,
  publish: async (id: number) => (await api.patch<Article>(`/articles/${id}/publish`)).data,
  unpublish: async (id: number) => (await api.patch<Article>(`/articles/${id}/unpublish`)).data,
  remove: async (id: number) => { await api.delete(`/articles/${id}`); },
};

export const videosApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<Video>>('/videos', { params })).data,
  publicList: async (params?: QueryParams) => safePublicPage(api.get<PageResponse<Video>>('/videos/public', { params }), Number(params?.size ?? 0)),
  get: async (id: number) => (await api.get<Video>(`/videos/${id}`)).data,
  getPublicBySlug: async (slug: string) => (await api.get<Video>(`/videos/public/${slug}`)).data,
  create: async (payload: Record<string, unknown>) => (await api.post<Video>('/videos', payload)).data,
  update: async (id: number, payload: Record<string, unknown>) => (await api.put<Video>(`/videos/${id}`, payload)).data,
  publish: async (id: number) => (await api.patch<Video>(`/videos/${id}/publish`)).data,
  unpublish: async (id: number) => (await api.patch<Video>(`/videos/${id}/unpublish`)).data,
  feature: async (id: number) => (await api.patch<Video>(`/videos/${id}/feature`)).data,
  unfeature: async (id: number) => (await api.patch<Video>(`/videos/${id}/unfeature`)).data,
  remove: async (id: number) => { await api.delete(`/videos/${id}`); },
};

export type UploadResponse = {
  identifier: string;
  url: string;
  resourceType: 'IMAGE' | 'RAW' | 'VIDEO';
  format: string | null;
  size: number;
};

export const uploadsApi = {
  articleImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (await api.post<UploadResponse>('/uploads/article-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },

  video: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (await api.post<UploadResponse>('/uploads/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },

  videoThumbnail: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return (await api.post<UploadResponse>('/uploads/video-thumbnail', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
};

export const usersApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<User>>('/users', { params })).data,
  get: async (id: number) => (await api.get<User>(`/users/${id}`)).data,
  create: async (payload: Record<string, unknown>) => (await api.post<User>('/users', payload)).data,
  update: async (id: number, payload: Record<string, unknown>) => (await api.put<User>(`/users/${id}`, payload)).data,
  enable: async (id: number) => (await api.patch<User>(`/users/${id}/enable`)).data,
  disable: async (id: number) => (await api.patch<User>(`/users/${id}/disable`)).data,
  remove: async (id: number) => { await api.delete(`/users/${id}`); },
};

export const rolesApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<Role>>('/roles', { params })).data,
  get: async (id: number) => (await api.get<Role>(`/roles/${id}`)).data,
  create: async (payload: { name: string }) => (await api.post<Role>('/roles', payload)).data,
  update: async (id: number, payload: { name: string }) => (await api.put<Role>(`/roles/${id}`, payload)).data,
  remove: async (id: number) => { await api.delete(`/roles/${id}`); },
};

export const permissionsApi = {
  list: async (params?: QueryParams) => (await api.get<PageResponse<Permission>>('/permissions', { params })).data,
  get: async (id: number) => (await api.get<Permission>(`/permissions/${id}`)).data,
  create: async (payload: { name: string }) => (await api.post<Permission>('/permissions', payload)).data,
  update: async (id: number, payload: { name: string }) => (await api.put<Permission>(`/permissions/${id}`, payload)).data,
  remove: async (id: number) => { await api.delete(`/permissions/${id}`); },
};

export const rolePermissionsApi = {
  list: async (roleId: number) => (await api.get<Permission[]>(`/roles/${roleId}/permissions`)).data,
  update: async (roleId: number, permissionIds: number[]) => (await api.put<Permission[]>(`/roles/${roleId}/permissions`, { permissionIds })).data,
};


export const auditApi = { list: async (params?: QueryParams) => (await api.get<PageResponse<AuditLogResponse>>('/audit-logs', { params })).data };

export const reviewsApi = {
  create: async (payload: {
    name: string;
    roleTitle?: string;
    company?: string;
    rating: number;
    reviewText: string;
  }) => (await api.post<Review>('/reviews', payload)).data,

  publicList: async (params?: QueryParams) =>
      safePublicPage(
          api.get<PageResponse<Review>>(
              '/reviews/public',
              { params },
          ),
          Number(params?.size ?? 0),
      ),

  list: async (params?: QueryParams) =>
      (await api.get<PageResponse<Review>>(
          '/reviews',
          { params },
      )).data,

  updateStatus: async (
      id: number,
      status: ReviewStatus,
  ) =>
      (
          await api.patch<Review>(
              `/reviews/${id}/status`,
              { status },
          )
      ).data,

  remove: async (id: number) => {
    await api.delete(`/reviews/${id}`);
  },
};
