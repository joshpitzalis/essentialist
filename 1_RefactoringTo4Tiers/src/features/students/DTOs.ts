import { isMissingKeys } from "../../utilities";
import type { Request } from "express";

export class AssignStudentDTO {

    constructor(public studentId: string, public assignmentId: string) {
    }

    static fromRequest(req: Request) {
        const requiredKeys = ["studentId", "assignmentId"];
        const isRequestInvalid = !req.body || typeof req.body !== "object" || isMissingKeys(req.body, requiredKeys)

        if (isRequestInvalid) {
            throw new Error("Invalid request");
        }

        const { studentId, assignmentId } = req.body as { studentId: string, assignmentId: string };
        return new AssignStudentDTO(studentId, assignmentId);
    }
}