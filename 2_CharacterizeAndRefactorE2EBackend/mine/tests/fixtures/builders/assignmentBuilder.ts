import { faker } from "@faker-js/faker";
import { Assignment, Class } from "@prisma/client";
import { prisma } from "../../../src/database";
import { classroomBuilder } from "./classroomBuilder";

export class assignmentBuilder {
  private props: Partial<Assignment>;
  private classroom?: Class | classroomBuilder;

  constructor() {
    this.props = { title: faker.lorem.words(3) };
  }

  fromClassroom(classroom: Class | classroomBuilder) {
    this.classroom = classroom;
    return this;
  }

  withTitle(title: string) {
    this.props.title = title;
    return this;
  }

  async build() {
    const classroomRecord =
      this.classroom instanceof classroomBuilder
        ? await this.classroom.build()
        : this.classroom ??
          (await prisma.class.create({
            data: { name: faker.commerce.department() },
          }));

    return prisma.assignment.create({
      data: {
        title: this.props.title as string,
        classId: classroomRecord.id,
      },
    });
  }
}
