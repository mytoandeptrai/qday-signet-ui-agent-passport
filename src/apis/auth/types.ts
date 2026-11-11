export interface RequestLoginCodeParams {
  email: string;
}

export interface VerifyLoginCodeParams {
  email: string;
  code: string;
}
