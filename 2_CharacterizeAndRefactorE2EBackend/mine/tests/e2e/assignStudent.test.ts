/// <reference types="jest" />
import type { Assignment, Class, Student } from "@prisma/client";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { app } from "../../src/index";
import { assignmentBuilder } from "../fixtures/builders/assignmentBuilder";
import { classroomBuilder } from "../fixtures/builders/classroomBuilder";
import { studentBuilder } from "../fixtures/builders/studentBuilder";
import { studentEnrollmentBuilder } from "../fixtures/builders/studentEnrollmentBuilder";
import { resetDatabase } from "../fixtures/reset";
const feature = loadFeature(
  path.join(__dirname, "../features/assignStudent.feature")
);

afterEach(async () => {
  await resetDatabase();
});

defineFeature(feature, (test) => {
  test("Assign a student to an assignment", ({ given, and, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: Student;
    let assignment: Assignment;
    let mathClass: Class;

    given("there is an existing student enrolled to a class", async () => {
      const newStudent = await new studentBuilder()
        .withName("Johnny")
        .withRandomEmail()
        .build();

      mathClass = await new classroomBuilder().withClassName("Math").build();
      const enrollmentResult = await new studentEnrollmentBuilder()
        .fromClassroom(mathClass)
        .and(newStudent)
        .build();
      student = enrollmentResult.student;
    });

    and("an assignment exists for the class", async () => {
      assignment = await new assignmentBuilder()
        .fromClassroom(mathClass)
        .build();
    });

    when("I assign the student the assignment", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
      };

      response = await request(app)
        .post("/student-assignments")
        .send(requestBody);
    });

    then("the student should be assigned to the assignment", () => {
      expect(response.status).toBe(201);
      expect(response.body.data.studentId).toBe(student.id);
      expect(response.body.data.assignmentId).toBe(assignment.id);
    });
  });
});
