import { Database } from "../../database";

export class classServices {
  constructor(private db: Database) {
    this.db = db;
  }

  async createClassService(name: string) {
    return await this.db.createClass(name);
  }

  async getClassService(id: string) {
    return await this.db.getClassById(id);
  }

  async getDuplicatedClassEnrollmentService(
    studentId: string,
    classId: string
  ) {
    return await this.db.getDuplicatedClassEnrollmentService(
      studentId,
      classId
    );
  }

  async createClassEnrollmentService(studentId: string, classId: string) {
    return this.db.createClassEnrollmentService(studentId, classId);
  }
}
