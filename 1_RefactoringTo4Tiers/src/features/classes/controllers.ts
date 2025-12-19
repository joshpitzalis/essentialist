import { isMissingKeys, parseForResponse } from "../../utilities";
import express, { type Request, type Response, type Router } from "express";
import { ErrorExceptionHandler } from "../../errorHandler";
import {
  InvalidRequestBodyException,
  StudentNotFoundException,
  StudentAlreadyEnrolledException,
  ClassNotFoundException,
} from "../errors";
import { classServices } from "./services";
import { studentServices } from "../students/services";

export default class ClassesController {
  private router: Router;

  constructor(
    private classService: classServices,
    private studentService: studentServices,
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
    this.router.post("/", this.createClassController);
    this.router.post("/class-enrollments", this.assignStudentToClassController);
  }

  private createClassController = async (
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

      const cls = await this.classService.createClassService(name);

      res
        .status(201)
        .json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      next(error);
    }
  };

  private assignStudentToClassController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const requiredKeys = ["studentId", "classId"];

      if (isMissingKeys(req.body, requiredKeys)) {
        throw new InvalidRequestBodyException(requiredKeys);
      }

      const { studentId, classId } = req.body;

      // check if student exists
      const student = await this.studentService.getStudentService(studentId);

      if (!student) {
        throw new StudentNotFoundException();
      }

      // check if class exists
      const cls = await this.classService.getClassService(classId);

      // check if student is already enrolled in class
      const duplicatedClassEnrollment =
        await this.classService.getDuplicatedClassEnrollmentService(
          studentId,
          classId
        );

      if (duplicatedClassEnrollment) {
        throw new StudentAlreadyEnrolledException();
      }

      if (!cls) {
        throw new ClassNotFoundException(classId);
      }

      const classEnrollment =
        await this.classService.createClassEnrollmentService(
          studentId,
          classId
        );

      res.status(201).json({
        error: undefined,
        data: parseForResponse(classEnrollment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
