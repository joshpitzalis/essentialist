import { ContactListAPI } from "./contactListAPI";

class CustomException extends Error {
  public type: string;
  constructor(message: string, type: string = "CustomException") {
    super(message);
    this.type = type;
  }
}

class ServerErrorException extends CustomException {
  constructor() {
    super("An error occurred", "ServerErrorException");
  }
}

export class MarketingService {
  constructor(private contactListAPI: ContactListAPI) {}

  async addEmailToList(email: string) {
    try {
      const result = await this.contactListAPI.addEmailToList(email);
      return result;
    } catch (err) {
      throw new ServerErrorException();
    }
  }
}
