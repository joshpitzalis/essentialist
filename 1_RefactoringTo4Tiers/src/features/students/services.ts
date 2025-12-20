import { Database } from "../../database";
import { CreateStudentDTO, GetStudentIdDTO } from "./DTOs";

export class studentServices {
  constructor(private db: Database) {
    this.db = db;
  }
  async createStudentService(dto: CreateStudentDTO) {
    const student = await this.db.createStudent(dto.name);
    return student;
  }

  async getStudentsService() {
    return await this.db.getAllStudents();
  }

  async getStudentService(dto: GetStudentIdDTO) {
    return await this.db.getStudentById(dto.id);
  }
}
