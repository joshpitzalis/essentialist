import { faker } from "@faker-js/faker";
import { Class, ClassEnrollment, Student } from "@prisma/client";
import { prisma } from "../../../src/database";
import { classroomBuilder } from "./classroomBuilder";
import { studentBuilder } from "./studentBuilder";

export class studentEnrollmentBuilder {
  private classroom?: Class;
  private student?: Student;

  fromClassroom(classroom: Class) {
    this.classroom = classroom;
    return this;
  }

  and(student: Student) {
    this.student = student;
    return this;
  }

  private async resolveClassroom() {
    if (this.classroom instanceof classroomBuilder) {
      return this.classroom.build();
    }

    if (this.classroom) {
      return this.classroom;
    }

    return prisma.class.create({
      data: { name: faker.commerce.department() },
    });
  }

  private async resolveStudent() {
    if (this.student instanceof studentBuilder) {
      return this.student.build();
    }

    if (this.student) {
      return this.student;
    }

    return new studentBuilder().build();
  }

  async build() {
    const classroomRecord = await this.resolveClassroom();
    const studentRecord = await this.resolveStudent();

    const enrollment: ClassEnrollment = await prisma.classEnrollment.create({
      data: {
        classId: classroomRecord.id,
        studentId: studentRecord.id,
      },
    });

    return {
      classroom: classroomRecord,
      student: studentRecord,
      enrollment,
    };
  }
}
