import { APIResponse, GenericErrors } from ".";

export type AddEmailToListErrors = GenericErrors;
export type AddEmailToListResponse = APIResponse<boolean, AddEmailToListErrors>;

export type MarketingResponse = APIResponse<
  AddEmailToListResponse | null,
  AddEmailToListErrors
>;
