import { prisma, Database } from "../../database";
import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../errors";

export async function assignStudentService({
  studentId,
  assignmentId,
}: {
  studentId: string;
  assignmentId: string;
}) {
  const student = await Database.getStudentById(studentId);

  if (!student) {
    throw new StudentNotFoundException();
  }

  const assignment = await prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
  });

  if (!assignment) {
    throw new AssignmentNotFoundException();
  }

  const studentAssignment = await prisma.studentAssignment.create({
    data: {
      studentId,
      assignmentId,
    },
  });

  return studentAssignment;
}
