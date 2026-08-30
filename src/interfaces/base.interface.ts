export interface IBaseResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
  totalPages: number;
}

export interface IPaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

