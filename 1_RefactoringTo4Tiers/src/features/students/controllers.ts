import { isMissingKeys, parseForResponse, isUUID } from "../../utilities";
import express, { type Request, type Response, type Router } from "express";
import { ErrorExceptionHandler } from "../../errorHandler";
import {
  InvalidRequestBodyException,
  StudentNotFoundException,
} from "../errors";
import type { studentServices } from "./services";
import { CreateStudentDTO, GetStudentIdDTO } from "./DTOs";

export default class StudentController {
  private router: Router;

  constructor(
    private studentServices: studentServices,
    private errorHandler: ErrorExceptionHandler
  ) {
    this.router = express.Router();
    this.routes();
    this.setupErrorHandler();
  }

  getRouter() {
    return this.router;
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  private routes() {
    this.router.post("/", this.createStudentController);
    this.router.get("/", this.getStudentsController);
    this.router.get("/:id", this.getStudentByIdController);
  }

  private createStudentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = CreateStudentDTO.fromRequest(req);

      const student = await this.studentServices.createStudentService(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentsController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const students = await this.studentServices.getStudentsService();

      res.status(200).json({
        error: undefined,
        data: parseForResponse(students),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentByIdController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = GetStudentIdDTO.fromRequest(req);
      const student = await this.studentServices.getStudentService(dto);

      if (!student) {
        throw new StudentNotFoundException();
      }

      res.status(200).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
