import express from "express";
import AssignmentsController from "./features/assignments/controllers";
import ClassesController from "./features/classes/controllers";
import StudentsController from "./features/students/controllers";
import { ErrorExceptionHandler } from "./errorHandler";
import { assignStudentService } from "./features/assignments/services";

const studentsController = new StudentsController(
  "e",
  new ErrorExceptionHandler()
);
const classesController = new ClassesController(
  "e",
  new ErrorExceptionHandler()
);
const assignmentsController = new AssignmentsController(
  assignStudentService,
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
