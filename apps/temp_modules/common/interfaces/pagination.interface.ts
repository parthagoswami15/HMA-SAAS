export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class Pagination<T> {
  items: T[];
  meta: IPaginationMeta;

  constructor(items: T[], meta: IPaginationMeta) {
    this.items = items;
    this.meta = meta;
  }
}
