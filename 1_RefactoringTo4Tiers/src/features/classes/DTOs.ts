import { isMissingKeys, isUUID } from "../../utilities";
import { InvalidRequestBodyException } from "../errors";
import express from "express";

export class CreateClassDTO {
  constructor(public name: string) {}

  static fromRequest(req: express.Request) {
    const requiredKeys = ["name"];

    if (isMissingKeys(req.body, requiredKeys)) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = req.body;

    return new CreateClassDTO(name);
  }
}

export class GetClassIdDTO {
  constructor(public classId: string) {}

  static fromRequest(req: express.Request) {
    const requiredKeys = ["classId"];

    const isRequestInvalid =
      !req.body ||
      typeof req.body !== "object" ||
      isMissingKeys(req.body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { classId } = req.body;

    return new GetClassIdDTO(classId);
  }
}

export class GetClassIdFromParamsDTO {
  constructor(public classId: string) {}

  static fromRequest(req: express.Request) {
    const { classId } = req.params;

    if (!isUUID(classId)) {
      throw new InvalidRequestBodyException(["classId"]);
    }

    return new GetClassIdFromParamsDTO(classId);
  }
}
