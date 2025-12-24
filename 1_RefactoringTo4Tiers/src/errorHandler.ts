import { NextFunction, Request, Response } from "express";
import {
  InvalidRequestBodyException,
  StudentNotFoundException,
  StudentAlreadyEnrolledException,
  AssignmentNotFoundException,
  StudentAssignmentNotFoundException,
  ClassNotFoundException,
} from "./features/errors";

export const ErrorExceptionType = {
  ServerError: "ServerError",
};

export class ErrorExceptionHandler {
  public handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    if (error instanceof InvalidRequestBodyException) {
      return res.status(400).json({
        error: typeof InvalidRequestBodyException,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof StudentNotFoundException) {
      return res.status(404).json({
        error: typeof StudentNotFoundException,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof ClassNotFoundException) {
      return res.status(404).json({
        error: typeof ClassNotFoundException,
        data: undefined,
        success: false,
      });
    }

    if (error instanceof StudentAlreadyEnrolledException) {
      return res.status(400).json({
        error: typeof StudentAlreadyEnrolledException,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof AssignmentNotFoundException) {
      return res.status(400).json({
        error: typeof AssignmentNotFoundException,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    if (error instanceof StudentAssignmentNotFoundException) {
      return res.status(400).json({
        error: typeof StudentAssignmentNotFoundException,
        data: undefined,
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      error: ErrorExceptionType.ServerError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }
}
