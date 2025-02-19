export interface HistoryEntityDto {
  user: string;
  detail: string;
  data: unknown;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}
