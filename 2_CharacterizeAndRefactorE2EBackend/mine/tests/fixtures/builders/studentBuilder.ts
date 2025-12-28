// the student exists
// the classroom exists
// the student was added to the classroom
// the student was assigned the assignment
// the student submitted the assignment

import { faker } from "@faker-js/faker";
import { Student } from "@prisma/client";
import { prisma } from "../../../src/database";

export class studentBuilder {
  private props: Partial<Student>;

  constructor() {
    this.props = { name: "", email: "" };
  }

  withName(name: string) {
    this.props.name = name;
    return this;
  }

  withRandomEmail() {
    this.props.email = faker.internet.email();
    return this;
  }

  async build() {
    const student = await prisma.student.create({
      data: {
        name: this.props.name as string,
        email: this.props.email as string,
      },
    });

    return student;
  }
}
