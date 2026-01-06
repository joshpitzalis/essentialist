import { MarketingResponse } from "@question-scraper/shared/src/api/marketing";
import { NextFunction, Request, Response } from "express";
import { CustomException } from "../../errors";

export function marketingErrorHandler(
  error: CustomException,
  _: Request,
  res: Response,
  _next: NextFunction
): Response<MarketingResponse> {
  let responseBody: MarketingResponse;
  if (error.type === "InvalidRequestBodyException") {
    responseBody = {
      success: false,
      data: null,
      error: {
        message: error.message,
        code: "ValidationError",
      },
    };
    return res.status(400).json(responseBody);
  }

  responseBody = {
    success: false,
    data: null,
    error: {
      code: "ServerError",
    },
  };

  return res.status(500).json(responseBody);
}
