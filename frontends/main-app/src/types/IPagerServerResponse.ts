export interface IPagerServerResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  message?: string
}
