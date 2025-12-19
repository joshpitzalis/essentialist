import { prisma, Database } from "../../database";

export async function createClassService(name: string) {
  return prisma.class.create({
    data: {
      name,
    },
  });
}

export async function getStudentService(id: string) {
  return prisma.student.findUnique({
    where: {
      id,
    },
  });
}

export async function getClassService(id: string) {
  return prisma.class.findUnique({
    where: {
      id,
    },
  });
}

export async function getDuplicatedClassEnrollmentService(
  studentId: string,
  classId: string
) {
  return prisma.classEnrollment.findFirst({
    where: {
      studentId,
      classId,
    },
  });
}

export async function createClassEnrollmentService(
  studentId: string,
  classId: string
) {
  return prisma.classEnrollment.create({
    data: {
      studentId,
      classId,
    },
  });
}
