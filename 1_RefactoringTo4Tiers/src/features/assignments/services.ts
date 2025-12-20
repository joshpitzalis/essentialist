import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../errors";
import {
  getAssignmentByIdDTO,
  gradeAssignmentDTO,
  studentAssignmentDTO,
} from "./DTOs";
import { Database } from "../../database";
import { GetClassIdDTO } from "../classes/DTOs";

export class assignmentServices {
  constructor(private db: Database) {
    this.db = db;
  }

  async assignStudentService({
    studentId,
    assignmentId,
  }: {
    studentId: string;
    assignmentId: string;
  }) {
    const student = await this.db.getStudentById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await this.db.getAssignmentById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return await this.db.createStudentAssignment(studentId, assignmentId);
  }

  async getStudentAssignmentService(dto: studentAssignmentDTO) {
    return await this.db.getStudentAssignmentService(dto.id);
  }

  async updateStudentAssignmentService(dto: studentAssignmentDTO) {
    return await this.db.updateStudentAssignmentService(dto.id);
  }

  async createAssignmentService({
    classId,
    title,
  }: {
    classId: string;
    title: string;
  }) {
    return await this.db.createAssignmentService(classId, title);
  }

  async updateStudentAssignmentGradeService(dto: gradeAssignmentDTO) {
    return await this.db.updateStudentAssignmentGradeService(dto.id, dto.grade);
  }

  async getAssignmentByIdService(dto: getAssignmentByIdDTO) {
    return await this.db.getAssignmentByIdService(dto.id);
  }

  async getAssignmentsByClassIdService(dto: GetClassIdDTO) {
    return await this.db.getAssignmentsByClassIdService(dto.classId);
  }

  async getStudentSubmittedAssignmentsService(dto: studentAssignmentDTO) {
    return await this.db.getStudentSubmittedAssignmentsService(dto.id);
  }

  async getStudentGradesService(dto: studentAssignmentDTO) {
    return await this.db.getStudentGradesService(dto.id);
  }
}
