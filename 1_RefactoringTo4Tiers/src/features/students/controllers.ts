import { isMissingKeys, parseForResponse, isUUID } from "../../utilities";
import { prisma } from "../../database";
import express, { type Request, type Response, type Router } from "express";
import { assignStudentService } from "../assignments/services";
import { ErrorExceptionHandler } from "../../errorHandler";
import {
  InvalidRequestBodyException,
  StudentNotFoundException,
} from "../errors";
import {
  createStudentService,
  getStudentService,
  getStudentsService,
} from "./services";

export default class StudentController {
  private router: Router;

  constructor(
    private studentService: string,
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
      const requiredKeys = ["name"];
      if (isMissingKeys(req.body, requiredKeys)) {
        throw new InvalidRequestBodyException(requiredKeys);
      }

      const { name } = req.body;

      const student = await createStudentService(name);

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
      const students = await getStudentsService();

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
      const { id } = req.params;
      if (!isUUID(id)) {
        throw new InvalidRequestBodyException(["id"]);
      }
      const student = await getStudentService(id);

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
