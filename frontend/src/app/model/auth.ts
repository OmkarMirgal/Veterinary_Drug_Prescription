export interface ISignupData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  licence: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  message: string;
}
