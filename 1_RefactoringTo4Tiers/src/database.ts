import { PrismaClient } from "@prisma/client";

export class Database {
  constructor(private prisma: PrismaClient) {}

  async saveStudent(name: string) {
    return await this.prisma.student.create({
      data: {
        name,
      },
    });
  }

  async getAllStudents() {
    return await this.prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getStudentById(id: string) {
    return await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });
  }

  async createStudent(name: string) {
    return await this.prisma.student.create({
      data: {
        name,
      },
    });
  }

  async createClass(name: string) {
    return await this.prisma.class.create({
      data: {
        name,
      },
    });
  }

  async getClassById(id: string) {
    return await this.prisma.class.findUnique({
      where: {
        id,
      },
    });
  }

  async getDuplicatedClassEnrollmentService(
    studentId: string,
    classId: string
  ) {
    return await this.prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });
  }

  async createClassEnrollmentService(studentId: string, classId: string) {
    return await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  }

  async getAssignmentById(id: string) {
    return await this.prisma.assignment.findUnique({
      where: {
        id,
      },
    });
  }

  async createStudentAssignment(studentId: string, assignmentId: string) {
    return await this.prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });
  }

  async getStudentAssignmentService(id: string) {
    return await this.prisma.studentAssignment.findUnique({
      where: {
        id,
      },
    });
  }

  async updateStudentAssignmentService(id: string) {
    return await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });
  }

  async createAssignmentService(classId: string, title: string) {
    return await this.prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });
  }

  async updateStudentAssignmentGradeService(id: string, grade: string) {
    return await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        grade,
      },
    });
  }

  async getAssignmentByIdService(id: string) {
    return await this.prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });
  }

  async getAssignmentsByClassIdService(id: string) {
    return await this.prisma.assignment.findMany({
      where: {
        classId: id,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });
  }

  async getStudentSubmittedAssignmentsService(id: string) {
    return await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });
  }

  async getStudentGradesService(id: string) {
    return await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });
  }
}
