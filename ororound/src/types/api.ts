export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface CreateUserRequest {
  kycHash: string;
  walletAddress: string;
}

export interface CreateUserResponse {
  userId: string;
  kycHash: string;
  walletAddress: string;
  createdAt: string;
}

export interface User {
  userId: string;
  kycHash: string;
  walletAddress: string;
  createdAt: string;
}
