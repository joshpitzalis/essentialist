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

export async function getStudentAssignmentService(id: string) {
  return prisma.studentAssignment.findUnique({
    where: {
      id,
    },
  });
}

export async function updateStudentAssignmentService(id: string) {
  return prisma.studentAssignment.update({
    where: {
      id,
    },
    data: {
      status: "submitted",
    },
  });
}

export async function createAssignmentService({
  classId,
  title,
}: {
  classId: string;
  title: string;
}) {
  return prisma.assignment.create({
    data: {
      classId,
      title,
    },
  });
}

export async function updateStudentAssignmentGradeService({
  id,
  grade,
}: {
  id: string;
  grade: string;
}) {
  return prisma.studentAssignment.update({
    where: {
      id,
    },
    data: {
      grade,
    },
  });
}

export async function getAssignmentByIdService(id: string) {
  return prisma.assignment.findUnique({
    include: {
      class: true,
      studentTasks: true,
    },
    where: {
      id,
    },
  });
}

export async function getAssignmentsByClassIdService(id: string) {
  return prisma.assignment.findMany({
    where: {
      classId: id,
    },
    include: {
      class: true,
      studentTasks: true,
    },
  });
}

export async function getStudentSubmittedAssignmentsService(id: string) {
  return prisma.studentAssignment.findMany({
    where: {
      studentId: id,
      status: "submitted",
    },
    include: {
      assignment: true,
    },
  });
}

export async function getStudentGradesService(id: string) {
  return prisma.studentAssignment.findMany({
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
