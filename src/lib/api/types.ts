export enum ApiResponseStatus {
  Success = "success",
  Fail = "fail",
  Error = "error",
}

export type ApiResponse<T = unknown> = {
  status:  ApiResponseStatus;
  data: T;
  status_code: number;
  message?: string;
}