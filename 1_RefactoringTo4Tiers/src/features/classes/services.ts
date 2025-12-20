import { Database } from "../../database";
import { CreateClassDTO, GetClassIdDTO } from "./DTOs";
import { GetStudentIdDTO } from "../students/DTOs";

export class classServices {
  constructor(private db: Database) {
    this.db = db;
  }

  async createClassService(dto: CreateClassDTO) {
    return await this.db.createClass(dto.name);
  }

  async getClassService(dto: GetClassIdDTO) {
    return await this.db.getClassById(dto.classId);
  }

  async getDuplicatedClassEnrollmentService(
    studentDTO: GetStudentIdDTO,
    classDTO: GetClassIdDTO
  ) {
    return await this.db.getDuplicatedClassEnrollmentService(
      studentDTO.id,
      classDTO.classId
    );
  }

  async createClassEnrollmentService(studentId: string, classId: string) {
    return this.db.createClassEnrollmentService(studentId, classId);
  }
}
