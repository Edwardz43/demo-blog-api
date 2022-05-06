export class CreateUserRequest {
  email: string;
  name: string;
}

export class User {
  id: number;
  email: string;
  name: string;
}

export class FindUserByIdRequest {
  id: number;
}

export class FindUserByEmailRequest {
  email: string;
}
