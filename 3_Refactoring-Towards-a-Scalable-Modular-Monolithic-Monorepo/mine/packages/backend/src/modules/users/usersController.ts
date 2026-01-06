import {
  CreateUserResponse,
  GetUserByEmailResponse,
} from "@question-scraper/shared/src/api/users";
import express, { NextFunction, Request, Response } from "express";
import { CustomException } from "../../errors";
import { CreateUserCommand } from "./usersCommand";
import { UsersService } from "./usersService";

export type ErrorHandler = (
  error: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;

export class UsersController {
  private router: express.Router;

  constructor(
    private usersService: UsersService,
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
    this.router.post("/new", this.createUser.bind(this));
    this.router.get("/:email", this.getUserByEmail.bind(this));
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private async createUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const command = CreateUserCommand.fromRequest(req.body);
      const user = await this.usersService.createUser(command);
      const response: CreateUserResponse = {
        success: true,
        data: user,
        error: {},
      };
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  private async getUserByEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const email = req.params.email;
      const user = await this.usersService.getUserByEmail(email);
      const response: GetUserByEmailResponse = {
        success: true,
        data: user,
        error: {},
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
