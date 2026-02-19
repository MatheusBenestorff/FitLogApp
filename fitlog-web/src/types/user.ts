export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  gender?: string;
  birthday?: string;
}

export interface UserDetailsDto {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthday: string;
}