import { APIResponse, GenericErrors, ServerError } from "./index";

UserResponse;

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

export type EmailAlreadyInUseError = "EmailAlreadyInUse";
export type UsernameAlreadyTakenError = "UsernameAlreadyTaken";
export type CreateUserErrors =
  | GenericErrors
  | EmailAlreadyInUseError
  | UsernameAlreadyTakenError;

export type CreateUserResponse = APIResponse<User, CreateUserErrors>;

export type UserNotFoundError = "UserNotFound";
export type GetUserByEmailErrors = ServerError | UserNotFoundError;
export type GetUserByEmailResponse = APIResponse<User, GetUserByEmailErrors>;

export type GetUserErrors = GetUserByEmailErrors | CreateUserErrors;

export type UserResponse = APIResponse<
  CreateUserResponse | GetUserByEmailResponse | null,
  GetUserErrors
>;
