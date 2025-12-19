import { isMissingKeys } from "../../utilities";
import type { Request } from "express";
import { InvalidRequestBodyException } from "../errors";

export class AssignStudentDTO {

    constructor({ studentId, assignmentId }: { studentId: string, assignmentId: string }) {
        this.studentId = studentId;
        this.assignmentId = assignmentId;
    }

    studentId: string;
    assignmentId: string;

    static fromRequest(req: Request) {
        const requiredKeys = ["studentId", "assignmentId"];
        const isRequestInvalid = !req.body || typeof req.body !== "object" || isMissingKeys(req.body, requiredKeys)

        if (isRequestInvalid) {
            throw new InvalidRequestBodyException(requiredKeys)
        }

        const { studentId, assignmentId } = req.body as { studentId: string, assignmentId: string };
        return new AssignStudentDTO({ studentId, assignmentId });
    }
}