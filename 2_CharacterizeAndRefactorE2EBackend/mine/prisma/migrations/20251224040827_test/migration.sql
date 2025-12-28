/*
  Warnings:

  - The primary key for the `StudentAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `grade` on the `StudentAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `StudentAssignment` table. All the data in the column will be lost.
  - The required column `id` was added to the `StudentAssignment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentAssignmentId" TEXT NOT NULL,
    "submissionContent" TEXT,
    CONSTRAINT "AssignmentSubmission_studentAssignmentId_fkey" FOREIGN KEY ("studentAssignmentId") REFERENCES "StudentAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GradedAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentSubmissionId" TEXT NOT NULL,
    "grade" TEXT,
    CONSTRAINT "GradedAssignment_assignmentSubmissionId_fkey" FOREIGN KEY ("assignmentSubmissionId") REFERENCES "AssignmentSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    CONSTRAINT "StudentAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudentAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StudentAssignment" ("assignmentId", "studentId") SELECT "assignmentId", "studentId" FROM "StudentAssignment";
DROP TABLE "StudentAssignment";
ALTER TABLE "new_StudentAssignment" RENAME TO "StudentAssignment";
CREATE UNIQUE INDEX "StudentAssignment_studentId_assignmentId_key" ON "StudentAssignment"("studentId", "assignmentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "GradedAssignment_assignmentSubmissionId_key" ON "GradedAssignment"("assignmentSubmissionId");
