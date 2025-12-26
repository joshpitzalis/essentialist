import { faker } from "@faker-js/faker";
import { Class } from "@prisma/client";
import { prisma } from "../../../src/database";

export class classroomBuilder {
  private props: Partial<Class>;

  constructor() {
    this.props = { name: faker.commerce.department() };
  }

  withClassName(name: string) {
    this.props.name = name;
    return this;
  }

  withRandomName() {
    this.props.name = faker.commerce.department();
    return this;
  }

  async build() {
    return prisma.class.create({
      data: {
        name: this.props.name as string,
      },
    });
  }
}
