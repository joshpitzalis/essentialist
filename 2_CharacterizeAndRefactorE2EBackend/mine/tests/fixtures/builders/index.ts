import { assignmentBuilder } from "./assignmentBuilder";
import { classroomBuilder } from "./classroomBuilder";
import { studentBuilder } from "./studentBuilder";
import { studentEnrollmentBuilder } from "./studentEnrollmentBuilder";

export function aStudent() {
  return new studentBuilder();
}

export function aClassRoom() {
  return new classroomBuilder();
}

export function anAssignment() {
  return new assignmentBuilder();
}

export function anEnrolledStudent() {
  return new studentEnrollmentBuilder();
}
