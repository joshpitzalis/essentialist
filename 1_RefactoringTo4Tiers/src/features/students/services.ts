import { prisma, Database } from "../../database";

export async function createStudentService(name: string) {
  prisma.student.create({
    data: {
      name,
    },
  });
}

export async function getStudentsService() {
  return prisma.student.findMany({
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

export async function getStudentService(id: string) {
  return prisma.student.findUnique({
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
