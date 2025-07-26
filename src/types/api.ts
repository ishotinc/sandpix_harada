export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UsageInfo {
  current: number;
  limit: number;
  remaining: number;
  resetsAt?: string;
  isAdmin?: boolean;
}

// Common error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  validationErrors?: ValidationError[];
}