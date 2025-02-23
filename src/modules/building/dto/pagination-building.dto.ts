export class PaginationBuildingDto {
  cursor?: string;
  page: number = 1;
  limit: number;
  direction: 'next' | 'prev' = 'next';

  constructor(partial?: Partial<PaginationBuildingDto>) {
    this.cursor = partial?.cursor || undefined;
    this.page =
      partial?.page && !isNaN(Number(partial.page)) ? Number(partial.page) : 1;
    this.limit = [10, 50, 100].includes(Number(partial?.limit))
      ? Number(partial?.limit)
      : 10;
    this.direction = partial?.direction === 'prev' ? 'prev' : 'next';
  }
}
