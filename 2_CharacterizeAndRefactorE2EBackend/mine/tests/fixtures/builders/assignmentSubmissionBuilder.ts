import {
  Assignment,
  AssignmentSubmission,
  Class,
  Student,
} from "@prisma/client";
import { prisma } from "../../../src/database";

export class assignmentSubmissionBuilder {
  private classroom?: Class;
  private student?: Student;
  private assignment?: Assignment;

  fromStudent(student: Student) {
    this.student = student;
    return this;
  }

  andFromClass(classroom: Class) {
    this.classroom = classroom;
    return this;
  }

  andWithAssignment(assignment: Assignment) {
    this.assignment = assignment;
    return this;
  }

  async build() {
    if (!this?.assignment?.id || !this?.student?.id) {
      return;
    }

    // Find or create the StudentAssignment
    let studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        studentId_assignmentId: {
          studentId: this.student.id,
          assignmentId: this.assignment.id,
        },
      },
    });

    if (!studentAssignment) {
      studentAssignment = await prisma.studentAssignment.create({
        data: {
          studentId: this.student.id,
          assignmentId: this.assignment.id,
        },
      });
    }

    const submission: AssignmentSubmission =
      await prisma.assignmentSubmission.create({
        data: {
          studentAssignmentId: studentAssignment.id,
        },
      });

    return {
      submission,
    };
  }
}
