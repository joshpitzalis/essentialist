import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma }


export class Database {



    static async saveStudent(name: string) {
        const data = await prisma.student.create({
            data: {
                name,
            },
        });

        return data;
    }

    static async getAllStudents() {
        const data = await prisma.student.findMany({
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return data;
    }

    static async getStudentById(id: string) {
        const data = await prisma.student.findUnique({
            where: {
                id,
            },
            include: {
                classes: true,
                assignments: true,
                reportCards: true,
            },
        });

        return data;
    }

}