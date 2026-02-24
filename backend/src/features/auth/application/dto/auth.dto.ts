export interface RegisterUserRequestDto {
  email: string;
  password: string;
}

export interface RegisterUserResponseDto {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}
