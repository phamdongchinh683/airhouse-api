export class PaginationResult {
  result: any;
  page?: number;
  nextCursor?: string;
  prevCursor?: string;
  totalItems: number;
  limit?: number;
  pages?: number;
  constructor(
    result: any,
    page?: number,
    nextCursor?: string,
    prevCursor?: string,
    totalItems?: number,
    limit?: number,
    pages?: number,
  ) {
    this.result = result;
    this.page = page;
    this.nextCursor = nextCursor;
    this.prevCursor = prevCursor;
    this.totalItems = totalItems;
    this.limit = limit;
    this.pages = pages;
  }
}
