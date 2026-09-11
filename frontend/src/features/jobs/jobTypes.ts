import type { Job } from '../../types/api';

export type JobFilters = {
  title?: string;
  location?: string;
  type?: string;
  active?: boolean;
  page?: number;
  size?: number;
};

export const jobTypes = ['BPO', 'Customer Support', 'Sales', 'Technical Support', 'Collections', 'Back Office', 'Operations'] as const;

export function jobTypeLabel(type: string): string {
  return type.trim() || 'General';
}

export function jobSummary(job: Job): string {
  const text = job.description.replace(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 147)}…` : text;
}
