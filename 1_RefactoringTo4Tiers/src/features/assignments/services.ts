import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../errors";

import { Database } from "../../database";

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

  async getStudentAssignmentService(id: string) {
    return await this.db.getStudentAssignmentService(id);
  }

  async updateStudentAssignmentService(id: string) {
    return await this.db.updateStudentAssignmentService(id);
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

  async updateStudentAssignmentGradeService({
    id,
    grade,
  }: {
    id: string;
    grade: string;
  }) {
    return await this.db.updateStudentAssignmentGradeService(id, grade);
  }

  async getAssignmentByIdService(id: string) {
    return await this.db.getAssignmentByIdService(id);
  }

  async getAssignmentsByClassIdService(id: string) {
    return await this.db.getAssignmentsByClassIdService(id);
  }

  async getStudentSubmittedAssignmentsService(id: string) {
    return await this.db.getStudentSubmittedAssignmentsService(id);
  }

  async getStudentGradesService(id: string) {
    return await this.db.getStudentGradesService(id);
  }
}
