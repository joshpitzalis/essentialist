import { prisma, Database } from "../../database";


export async function assignStudentService(studentId: string, assignmentId: string) {
    const student = await Database.getStudentById(studentId)


    if (!student) {
        throw new Error("Student not found");
    }

    const assignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId
        }
    });

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    const studentAssignment = await prisma.studentAssignment.create({
        data: {
            studentId,
            assignmentId,
        }
    });

    return studentAssignment;
}