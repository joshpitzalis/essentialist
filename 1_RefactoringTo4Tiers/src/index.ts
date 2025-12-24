import express from "express";
import AssignmentsController from "./features/assignments/controllers";
import ClassesController from "./features/classes/controllers";
import StudentsController from "./features/students/controllers";
import { ErrorExceptionHandler } from "./errorHandler";
import { assignmentServices } from "./features/assignments/services";
import { studentServices } from "./features/students/services";
import { classServices } from "./features/classes/services";
import { Database } from "./database";
import { PrismaClient } from "@prisma/client";
import Server from "./server";

const prisma = new PrismaClient();

const db = new Database(prisma);

const studentsController = new StudentsController(
  new studentServices(db),
  new ErrorExceptionHandler()
);
const classesController = new ClassesController(
  new classServices(db),
  new studentServices(db),
  new ErrorExceptionHandler()
);
const assignmentsController = new AssignmentsController(
  new assignmentServices(db),
  new classServices(db),
  new studentServices(db),
  new ErrorExceptionHandler()
);

export const server = new Server(
  studentsController,
  classesController,
  assignmentsController
);

const port = Number(process.env.PORT) || 3000;

server.start(port);
