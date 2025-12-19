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

const app = express();

app.use(express.json());

app.use("/students", studentsController.getRouter());
app.use("/classes", classesController.getRouter());
app.use("/assignments", assignmentsController.getRouter());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
