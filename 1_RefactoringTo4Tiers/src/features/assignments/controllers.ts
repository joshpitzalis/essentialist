import { isMissingKeys, parseForResponse, isUUID } from "../../utilities";
import express, { type Request, type Response, type Router } from "express";
import {
  AssignStudentDTO,
  createAssignmentDTO,
  getAssignmentByIdDTO,
  gradeAssignmentDTO,
  studentAssignmentDTO,
} from "../assignments/DTOs";
import { ErrorExceptionHandler } from "../../errorHandler";
import {
  InvalidRequestBodyException,
  StudentAssignmentNotFoundException,
  AssignmentNotFoundException,
  InvalidGradeException,
  ClassNotFoundException,
  StudentNotFoundException,
} from "../errors";
import { assignmentServices } from "./services";
import { classServices } from "../classes/services";
import { studentServices } from "../students/services";
import { GetStudentIdDTO } from "../students/DTOs";
import { GetClassIdDTO, GetClassIdFromParamsDTO } from "../classes/DTOs";

export default class AssignmentController {
  private router: Router;

  constructor(
    private assignmentServices: assignmentServices,
    private classServices: classServices,
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
    this.router.post("", this.assignStudentToAssignmentController);
    this.router.post("/assignments", this.createAssignmentController);
    this.router.post("/submit", this.submitAssignmentController);
    this.router.post("/grade", this.gradeAssignmentController);
    this.router.get("/assignments/:id", this.getAssignmentByIdController);
    this.router.get(
      "/student/:id",
      this.getStudentSubmittedAssignmentsController
    );
    this.router.get("/student/:id/grades", this.getStudentGradesController);
    this.router.get(
      "/classes/:classId",
      this.getAssignmentsByClassIdController
    );
  }

  private assignStudentToAssignmentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = AssignStudentDTO.fromRequest(req);
      const data = await this.assignmentServices.assignStudentService(dto);
      res.status(201).json({
        error: undefined,
        data: parseForResponse(data),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private submitAssignmentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = studentAssignmentDTO.fromRequest(req);
      // check if student assignment exists
      const studentAssignment =
        await this.assignmentServices.getStudentAssignmentService(dto);

      if (!studentAssignment) {
        throw new StudentAssignmentNotFoundException();
      }

      const studentAssignmentUpdated =
        await this.assignmentServices.updateStudentAssignmentService(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private createAssignmentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = createAssignmentDTO.fromRequest(req);
      const assignment = await this.assignmentServices.createAssignmentService(
        dto
      );

      res.status(201).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private gradeAssignmentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = gradeAssignmentDTO.fromRequest(req);

      // check if student assignment exists
      const studentAssignment =
        await this.assignmentServices.getStudentAssignmentService(dto);

      if (!studentAssignment) {
        throw new AssignmentNotFoundException();
      }

      const studentAssignmentUpdated =
        await this.assignmentServices.updateStudentAssignmentGradeService(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getAssignmentByIdController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = getAssignmentByIdDTO.fromRequest(req);
      const assignment = await this.assignmentServices.getAssignmentByIdService(
        dto
      );

      if (!assignment) {
        throw new AssignmentNotFoundException();
      }

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getAssignmentsByClassIdController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = GetClassIdFromParamsDTO.fromRequest(req);

      // check if class exists
      const cls = await this.classServices.getClassService(dto);

      if (!cls) {
        throw new ClassNotFoundException(dto.classId);
      }

      const assignments =
        await this.assignmentServices.getAssignmentsByClassIdService(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentSubmittedAssignmentsController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = GetStudentIdDTO.fromRequest(req);
      // check if student exists
      const student = await this.studentServices.getStudentService(dto);

      if (!student) {
        throw new StudentNotFoundException();
      }

      const studentAssignments =
        await this.assignmentServices.getStudentSubmittedAssignmentsService(
          dto
        );

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentGradesController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = GetStudentIdDTO.fromRequest(req);

      // check if student exists
      const student = await this.studentServices.getStudentService(dto);

      if (!student) {
        throw new StudentNotFoundException();
      }

      const studentAssignments =
        await this.assignmentServices.getStudentGradesService(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
