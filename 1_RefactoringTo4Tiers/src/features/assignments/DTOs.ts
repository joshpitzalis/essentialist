import { isMissingKeys, isUUID } from "../../utilities";
import type { Request } from "express";
import { InvalidRequestBodyException, InvalidGradeException } from "../errors";

export class AssignStudentDTO {
  constructor({
    studentId,
    assignmentId,
  }: {
    studentId: string;
    assignmentId: string;
  }) {
    this.studentId = studentId;
    this.assignmentId = assignmentId;
  }

  studentId: string;
  assignmentId: string;

  static fromRequest(req: Request) {
    const requiredKeys = ["studentId", "assignmentId"];
    const isRequestInvalid =
      !req.body ||
      typeof req.body !== "object" ||
      isMissingKeys(req.body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, assignmentId } = req.body as {
      studentId: string;
      assignmentId: string;
    };
    return new AssignStudentDTO({ studentId, assignmentId });
  }
}

export class studentAssignmentDTO {
  constructor({ id }: { id: string }) {
    this.id = id;
  }

  id: string;

  static fromRequest(req: Request) {
    const requiredKeys = ["id"];
    if (isMissingKeys(req.body, requiredKeys)) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = req.body;

    return new studentAssignmentDTO({ id });
  }
}

export class createAssignmentDTO {
  constructor({ title, classId }: { title: string; classId: string }) {
    this.title = title;
    this.classId = classId;
  }

  title: string;
  classId: string;

  static fromRequest(req: Request) {
    const requiredKeys = ["classId", "title"];
    if (isMissingKeys(req.body, requiredKeys)) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { classId, title } = req.body;

    return new createAssignmentDTO({ title, classId });
  }
}

export class gradeAssignmentDTO {
  constructor({ id, grade }: { id: string; grade: string }) {
    this.id = id;
    this.grade = grade;
  }

  id: string;
  grade: string;

  static fromRequest(req: Request) {
    const requiredKeys = ["id", "grade"];
    if (isMissingKeys(req.body, requiredKeys)) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id, grade } = req.body;

    // validate grade
    if (!["A", "B", "C", "D"].includes(grade)) {
      throw new InvalidGradeException(grade);
    }

    return new gradeAssignmentDTO({ id, grade });
  }
}

export class getAssignmentByIdDTO {
  constructor({ id }: { id: string }) {
    this.id = id;
  }

  id: string;

  static fromRequest(req: Request) {
    const requiredKeys = ["id"];
    if (isMissingKeys(req.body, requiredKeys)) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = req.body;

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new getAssignmentByIdDTO({ id });
  }
}

export class GetAssignmentIdFromParamsDTO {
  constructor(public id: string) {}

  static fromRequest(req: Request) {
    const { id } = req.params;

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new GetAssignmentIdFromParamsDTO(id);
  }
}
