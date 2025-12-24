/// <reference types="jest" />
import { Assignment, Class, Student } from "@prisma/client";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { app } from "../../src/index";
import { assignmentBuilder } from "../fixtures/builders/assignmentBuilder";
import { assignmentSubmissionBuilder } from "../fixtures/builders/assignmentSubmissionBuilder";
import { classroomBuilder } from "../fixtures/builders/classroomBuilder";
import { studentBuilder } from "../fixtures/builders/studentBuilder";
import { studentEnrollmentBuilder } from "../fixtures/builders/studentEnrollmentBuilder";
import { resetDatabase } from "../fixtures/reset";

const feature = loadFeature(
  path.join(__dirname, "../features/gradeAssignment.feature")
);

afterEach(async () => {
  await resetDatabase();
});

defineFeature(feature, (test) => {
  test("Successfully grade a submitted assignment", ({
    given,
    when,
    then,
    and,
  }) => {
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

    and("the student has submitted the assignment", async () => {
      const submission = await new assignmentSubmissionBuilder()
        .fromStudent(student)
        .andFromClass(mathClass)
        .andWithAssignment(assignment)
        .build();
    });

    when(`I assign the grade "A" to the student's assignment`, async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
        grade: "A",
      };

      response = await request(app)
        .post("/student-assignments/grade")
        .send(requestBody);
    });

    then("the assignment should be graded successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.data.grade).toBe(requestBody.grade);
    });
  });

  test("Attempt to grade an assignment without a submission", ({
    given,
    and,
    but,
    when,
    then,
  }) => {
    given("there is an existing student enrolled to a class", () => {});

    and("an assignment exists for the class", () => {});

    but("the student has not submitted the assignment", () => {});

    when("I attempt to assign a grade to the student's assignment", () => {});

    then("the grading should fail", () => {
      expect(true).toBe(false);
    });

    and(/^I should receive an error message "(.*)"$/, (arg0) => {});
  });

  test("Attempt to grade with an invalid grade value", ({
    given,
    and,
    when,
    then,
  }) => {
    given("there is an existing student enrolled to a class", () => {});

    and("an assignment exists for the class", () => {});

    and("the student has submitted the assignment", () => {});

    when(
      /^I assign the grade "(.*)" to the student's assignment$/,
      (arg0) => {}
    );

    then("the grading should fail", () => {
      expect(true).toBe(false);
    });

    and(/^I should receive an error message "(.*)"$/, (arg0) => {});
  });

  test("Attempt to grade a non-existent assignment", ({
    given,
    when,
    then,
    and,
  }) => {
    given("there is an existing student enrolled to a class", () => {});

    when("I attempt to assign a grade to a non-existent assignment", () => {});

    then("the grading should fail", () => {});

    and(/^I should receive an error message "(.*)"$/, (arg0) => {
      expect(true).toBe(false);
    });
  });
});
