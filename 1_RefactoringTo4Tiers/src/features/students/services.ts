import { Database } from "../../database";

export class studentServices {
  constructor(private db: Database) {
    this.db = db;
  }
  async createStudentService(name: string) {
    const student = await this.db.createStudent(name);
    return student;
  }

  async getStudentsService() {
    return await this.db.getAllStudents();
  }

  async getStudentService(id: string) {
    return await this.db.getStudentById(id);
  }
}
