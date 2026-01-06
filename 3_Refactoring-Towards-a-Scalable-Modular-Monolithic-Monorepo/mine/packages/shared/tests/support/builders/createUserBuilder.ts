export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

class TextUtil {
  public static createRandomText(length: number): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+";
    let text = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      text += charset.charAt(randomIndex);
    }

    return text;
  }

  public static createRandomEmail(): string {
    const randomSequence = Math.floor(Math.random() * 1000000);
    return `testemail-${randomSequence}@gmail.com`;
  }
}

export class CreateUserInputBuilder {
  private props: Partial<CreateUserInput>;

  constructor() {
    this.props = {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    };
  }

  public withAllRandomDetails() {
    // Note: You could also use faker.js
    this.withFirstName(TextUtil.createRandomText(10));
    this.withLastName(TextUtil.createRandomText(10));
    this.withEmail(TextUtil.createRandomEmail());
    this.withUsername(TextUtil.createRandomText(10));
    this.withPassword(TextUtil.createRandomText(12));

    return this;
  }

  public withFirstName(firstName: string) {
    this.props = {
      ...this.props,
      firstName,
    };
    return this;
  }

  public withLastName(lastName: string) {
    this.props = {
      ...this.props,
      lastName,
    };
    return this;
  }

  public withEmail(email: string) {
    this.props = {
      ...this.props,
      email,
    };
    return this;
  }

  public withUsername(username: string) {
    this.props = {
      ...this.props,
      username,
    };
    return this;
  }

  public withPassword(password: string) {
    this.props = {
      ...this.props,
      password,
    };
    return this;
  }

  public build() {
    return this.props;
  }
}
