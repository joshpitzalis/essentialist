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
import { CreateClassDTO, GetClassIdDTO } from "./DTOs";
import { GetStudentIdDTO } from "../students/DTOs";

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
      const dto = CreateClassDTO.fromRequest(req);

      const cls = await this.classService.createClassService(dto);

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
      const studentDTO = GetStudentIdDTO.fromRequest(req);
      // check if student exists
      const student = await this.studentService.getStudentService(studentDTO);

      if (!student) {
        throw new StudentNotFoundException();
      }

      const classDTO = GetClassIdDTO.fromRequest(req);

      // check if class exists
      const cls = await this.classService.getClassService(classDTO);

      // check if student is already enrolled in class
      const duplicatedClassEnrollment =
        await this.classService.getDuplicatedClassEnrollmentService(
          studentDTO,
          classDTO
        );

      if (duplicatedClassEnrollment) {
        throw new StudentAlreadyEnrolledException();
      }

      if (!cls) {
        throw new ClassNotFoundException(classDTO.classId);
      }

      const classEnrollment =
        await this.classService.createClassEnrollmentService(
          studentDTO.id,
          classDTO.classId
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
