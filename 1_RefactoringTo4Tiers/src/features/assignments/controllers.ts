import { isMissingKeys, parseForResponse, isUUID } from "../../utilities";
import * as Errors from "../../errorHandler";
import express, { type Request, type Response, type Router } from "express";
import { AssignStudentDTO } from "../assignments/DTOs";
import {
  createAssignmentService,
  getAssignmentByIdService,
  getAssignmentsByClassIdService,
  getStudentAssignmentService,
  getStudentGradesService,
  getStudentSubmittedAssignmentsService,
  updateStudentAssignmentGradeService,
  updateStudentAssignmentService,
  type assignStudentService,
} from "./services";
import { ErrorExceptionHandler } from "../../errorHandler";
import {
  InvalidRequestBodyException,
  StudentAssignmentNotFoundException,
  AssignmentNotFoundException,
  InvalidGradeException,
  ClassNotFoundException,
  StudentNotFoundException,
} from "../errors";
import { prisma } from "../../database";
import { getClassService } from "../classes/services";
import { getStudentService } from "../students/services";

export default class AssignmentController {
  private router: Router;

  constructor(
    private assignmentService: typeof assignStudentService,
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
    this.router.get("/classes/:id", this.getAssignmentsByClassIdController);
  }

  private assignStudentToAssignmentController = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const dto = AssignStudentDTO.fromRequest(req.body);
      const data = await this.assignmentService(dto);
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
      const requiredKeys = ["id"];
      if (isMissingKeys(req.body, requiredKeys)) {
        throw new InvalidRequestBodyException(requiredKeys);
      }

      const { id } = req.body;

      // check if student assignment exists
      const studentAssignment = await getStudentAssignmentService(id);

      if (!studentAssignment) {
        throw new StudentAssignmentNotFoundException();
      }

      const studentAssignmentUpdated = await updateStudentAssignmentService(id);

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
      const requiredKeys = ["classId", "title"];
      if (isMissingKeys(req.body, requiredKeys)) {
        throw new InvalidRequestBodyException(requiredKeys);
      }

      const { classId, title } = req.body;

      const assignment = await createAssignmentService({ classId, title });

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
      const requiredKeys = ["id", "grade"];
      if (isMissingKeys(req.body, requiredKeys)) {
        throw new InvalidRequestBodyException(requiredKeys);
      }

      const { id, grade } = req.body;

      // validate grade
      if (!["A", "B", "C", "D"].includes(grade)) {
        throw new InvalidGradeException(grade);
      }

      // check if student assignment exists
      const studentAssignment = await getStudentAssignmentService(id);

      if (!studentAssignment) {
        throw new AssignmentNotFoundException();
      }

      const studentAssignmentUpdated =
        await updateStudentAssignmentGradeService({
          id,
          grade,
        });

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
      const { id } = req.params;

      if (!isUUID(id)) {
        throw new InvalidRequestBodyException(["id"]);
      }
      const assignment = await getAssignmentByIdService(id);

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
      const { id } = req.params;
      if (!isUUID(id)) {
        throw new InvalidRequestBodyException(["id"]);
      }

      // check if class exists
      const cls = await getClassService(id);

      if (!cls) {
        throw new ClassNotFoundException(id);
      }

      const assignments = await getAssignmentsByClassIdService(id);

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
      const { id } = req.params;
      if (!isUUID(id)) {
        throw new InvalidRequestBodyException(["id"]);
      }

      // check if student exists
      const student = await getStudentService(id);

      if (!student) {
        throw new StudentNotFoundException();
      }

      const studentAssignments = await getStudentSubmittedAssignmentsService(
        id
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
      const { id } = req.params;
      if (!isUUID(id)) {
        throw new InvalidRequestBodyException(["id"]);
      }

      // check if student exists
      const student = await getStudentService(id);

      if (!student) {
        throw new StudentNotFoundException();
      }

      const studentAssignments = await getStudentGradesService(id);

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
