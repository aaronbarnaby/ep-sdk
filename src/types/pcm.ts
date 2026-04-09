import type { Identifiable } from './core';

export interface PcmJobBase {
  type: 'pim-job' | (string & {});
  attributes?: {
    completed_at?: string;
    created_at?: string;
    started_at?: string;
    status?: string;
    type?: string;
    updated_at?: string;
  };
  job_type?: string;
  link?: {
    href: string;
  };
  status?: 'pending' | 'processing' | 'complete' | 'failed' | 'completed';
}

export interface PcmJob extends Identifiable, PcmJobBase {
  meta?: {
    file_locations?: string[];
    filter?: string;
  };
}

export interface PcmJobError extends Identifiable {
  type: 'pim-job-error';
  attributes: {
    message: string;
  };
}
