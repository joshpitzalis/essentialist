import { isMissingKeys, isUUID } from "../../utilities";
import { InvalidRequestBodyException } from "../errors";
import express from "express";

export class CreateStudentDTO {
  constructor(public name: string) {}

  static fromRequest(req: express.Request) {
    const requiredKeys = ["name"];
    const isRequestInvalid =
      !req.body ||
      typeof req.body !== "object" ||
      isMissingKeys(req.body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = req.body as { name: string };

    return new CreateStudentDTO(name);
  }
}

export class GetStudentIdDTO {
  constructor(public id: string) {}

  static fromRequest(req: express.Request) {
    const { id } = req.params;

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new GetStudentIdDTO(id);
  }
}
