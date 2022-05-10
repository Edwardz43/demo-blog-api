export class User {
  id: number;
  email: string;
  name: string;
  password?: string;
}

export interface Profile {
  id?: number;
  userId?: number;
  avatar?: string;
  age?: number;
  phone?: string;
  address?: string;
  birthday?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FindUserByIdRequest {
  id: number;
}

export class FindUserByEmailRequest {
  email: string;
}

export class UpdateUserResponse {
  message: string;
}

export class UpdateUserRequest {
  user: User;
  profile?: Profile;
}

export class DeleteUserRequest {
  email: string;
  id: number;
  token: string;
}

export class DeleteUserResponse {
  message: string;
}
