import express from "express";

import { MarketingService } from "./marketingService";

import { NextFunction, Request, Response } from "express";
import { CustomException } from "../../errors";

export type ErrorHandler = (
  error: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;

type Error<U> = {
  message?: string;
  code?: U;
};

type APIResponse<T, U> = {
  success: boolean;
  data: T;
  error: Error<U>;
};

type ValidationError = "ValidationError";
type ServerError = "ServerError";

type AddEmailToListResponse = APIResponse<
  boolean,
  ValidationError | ServerError
>;

export class MarketingController {
  private router: express.Router;

  constructor(
    private marketingService: MarketingService,
    private errorHandler: ErrorHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/new", this.addEmailToList.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async addEmailToList(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const email = req.body.email;
      const result = await this.marketingService.addEmailToList(email);
      const response: AddEmailToListResponse = {
        success: true,
        data: result,
        error: {},
      };
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
