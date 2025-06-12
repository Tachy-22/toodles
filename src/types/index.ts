// Utility type for API responses
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

// Type for pagination
export type PaginationParams = {
  page: number;
  limit: number;
  totalPages?: number;
  totalItems?: number;
};

// Generic type for paginated API responses
export type PaginatedResponse<T> = {
  items: T[];
  pagination: PaginationParams;
};
