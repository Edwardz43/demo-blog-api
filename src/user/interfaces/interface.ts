export class CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export class User {
  id: number;
  email: string;
  name: string;
  password?: string;
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
  id: number;
  email?: string;
  name?: string;
}

export class DeleteUserRequest {
  email: string;
  id: number;
  token: string;
}

export class DeleteUserResponse {
  message: string;
}
