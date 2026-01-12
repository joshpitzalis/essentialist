import axios from "axios";
import { APIResponse, GenericErrors, ServerError } from "./index";

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

export const createUsersAPI = (apiURL: string) => {
  return {
    register: async (
      input: Partial<CreateUserParams>
    ): Promise<CreateUserResponse> => {
      try {
        const successResponse = await axios.post(`${apiURL}/users/new`, {
          ...input,
        });
        return successResponse.data as CreateUserResponse;
      } catch (err: any) {
        if (err.response?.data) {
          return err.response.data as CreateUserResponse;
        }
        throw err;
      }
    },
    getUserByEmail: async (email: string): Promise<GetUserByEmailResponse> => {
      try {
        const successResponse = await axios.get(`${apiURL}/users/${email}`);
        return successResponse.data as GetUserByEmailResponse;
      } catch (err: any) {
        if (err.response?.data) {
          return err.response.data as GetUserByEmailResponse;
        }
        throw err;
      }
    },
  };
};
