export class RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export class RegisterResponse {
  id: number;
  email?: string;
  name?: string;
}

export class LoginRequest {
  email: string;
  password: string;
}

export class LoginResponse {
  token?: string;
}
